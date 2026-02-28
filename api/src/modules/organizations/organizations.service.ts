import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from 'src/shared/database/repositories/organization.repository';
import { generateSlug } from 'src/shared/utils/generate-slug';
import { AuthUser } from 'src/shared/interfaces/auth-user.interface';
import { EnumRole, EnumStatus } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private readonly organizationRepo: OrganizationRepository) {}

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

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }

  //TALVEZ IMPLEMENTAR UM ALGORIMO DE ORDENAÇÃO NOS REGISTROS POSSA TORNAR A BUSCA MAIS RÁPIDA ? LEMBRAR DE TESTAR
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

    console.log(baseSlug);

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
}
