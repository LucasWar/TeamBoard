import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
// import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from 'src/shared/database/repositories/organization.repository';
import { generateSlug } from 'src/shared/utils/generate-slug';
import { AuthUser } from 'src/shared/interfaces/auth-user.interface';
import { EnumRole, EnumStatus } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';
import { MembershipsService } from '../memberships/memberships.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationRepo: OrganizationRepository,
    private readonly membershipsServ: MembershipsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    user: AuthUser | undefined,
  ) {
    const { name } = createOrganizationDto;

    if (!user) {
      throw new UnauthorizedException(
        'É necessário esta logado para essa operação',
      );
    }

    const slug = await this.createAndValidateSlug(name);

    const organization = await this.organizationRepo.create({
      data: {
        name,
        slug,
        ownerUserId: user.userId,
        memberships: {
          create: {
            userId: user.userId,
            role: EnumRole.ADMIN,
            status: EnumStatus.ACTIVE,
          },
        },
      },
    });

    return organization;
  }

  async findAll() {
    return this.organizationRepo.findMany();
  }

  async sumarryDashboard(orgId: string, userId: string) {
    const recentLogs = await this.auditLogService.findAll(orgId);

    const formartRecentLogs = this.formatActivityFeed(recentLogs, userId);

    return formartRecentLogs;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  async remove(id: string, userId: string) {
    const member = await this.membershipsServ.getMembershipByUserAndOrg(
      userId,
      id,
    );

    if (!member) {
      throw new UnauthorizedException('Usuário não pertence a organização');
    }

    await this.organizationRepo.delete({
      where: {
        id,
      },
    });
  }

  private async createAndValidateSlug(name: string) {
    const baseSlug = generateSlug(name);

    const existingSlugs = await this.organizationRepo.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: { slug: true },
    });

    if (existingSlugs.length === 0) {
      return baseSlug;
    }

    let maxSuffix = 0;

    for (const record of existingSlugs) {
      const slug = record.slug;

      if (slug === baseSlug) {
        maxSuffix = Math.max(maxSuffix, 1);
        continue;
      }

      const match = slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));

      if (match) {
        const num = Number(match[1]);
        if (!Number.isNaN(num)) {
          maxSuffix = Math.max(maxSuffix, num + 1);
        }
      }
    }

    if (maxSuffix === 0) {
      return `${baseSlug}-1`;
    }

    return `${baseSlug}-${maxSuffix}`;
  }

  private formatActivityFeed(logs: any[], currentUserId: string) {
    return logs.map(log => {
      const actorName = log.userId === currentUserId ? 'Você' : log.user.name;
      const metadata = log.metadata || {}; // O JSON que gravamos lá atrás

      let description = '';

      switch (log.action) {
        case 'PROJECT_CREATED':
          description = `criou o projeto "${metadata.projectName}".`;
          break;

        case 'PROJECT_ARCHIVED':
          description = `arquivou um projeto.`;
          break;

        case 'PROJECT_DELETE':
          description = `deletou um projeto.`;
          break;

        case 'TASK_CREATED':
          description = `criou a tarefa "${metadata.title}".`;
          break;

        case 'TASK_STATUS_CHANGED':
          description = `moveu uma tarefa para a coluna ${metadata.newStatus}.`;
          break;

        case 'COMMENT_CREATED':
          description = `comentou em uma tarefa.`;
          break;

        default:
          description = `realizou uma alteração no sistema.`;
      }

      return {
        id: log.id,
        actor: actorName,
        actorAvatar: log.user.avatar,
        description: description,
        fullText: `${actorName} ${description}`,
        createdAt: log.createdAt,
      };
    });
  }
}
