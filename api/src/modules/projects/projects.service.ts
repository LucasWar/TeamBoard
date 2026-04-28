import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { AuditLogService } from 'src/modules/audit-log/audit-log.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from 'src/shared/database/repositories/projects.repository';
import { FilterProjectDto } from './dto/filter-project.dto';
import { ProjectQueryBuilder } from './builder/projects-query-builder';
import { EnumStatusProject, Prisma } from '@prisma/client';
import { ChangeStatusDto } from './dto/change-status.dto';
import { TransactionManager } from 'src/shared/database/transaction.manager';
type ProjectWithTasks = Prisma.ProjectGetPayload<{
  select: { id: true; name: true; tasks: { select: { status: true } } };
}>;

@Injectable()
export class ProjectsService {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly projectRepo: ProjectsRepository,
    private readonly trasactionHelper: TransactionManager,
  ) {}

  async create(dto: CreateProjectDto, orgId: string, userId: string) {
    const existingProject = await this.projectRepo.findUnique({
      where: {
        organizationId_name: {
          organizationId: orgId,
          name: dto.name,
        },
      },
    });

    if (existingProject) {
      throw new ConflictException(
        'Já existe um projeto com este nome na sua organização.',
      );
    }

    const project = await this.projectRepo.create({
      data: {
        ...dto,
        organizationId: orgId,
        createdBy: userId,
      },
    });

    void this.auditLogService.logAction({
      action: 'PROJECT_CREATED',
      userId,
      organizationId: orgId,
      entityId: project.id,
      entityType: 'Project',
      metadata: { projectName: project.name },
    });

    return project;
  }

  async findAllByOrg(orgId: string, filter: FilterProjectDto) {
    const query = new ProjectQueryBuilder(filter, orgId).build();

    let projects: ProjectWithTasks[] = [];
    let totalResults = 0;
    await this.trasactionHelper.transaction(async (tx) => {
      projects = await this.projectRepo.findMany(
        {
          ...query,
          select: {
            id: true,
            name: true,
            description: true,
            organizationId: true,
            status: true,
            tasks: {
              select: {
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        tx,
      );

      totalResults = await this.projectRepo.count({
        where: query.where,
      });
    });

    const data = projects.map(({ tasks, ...project }) => {
      const tasksDone = tasks.reduce((acc, task) => {
        if (task.status == 'DONE') acc = acc + 1;
        return acc;
      }, 0);

      const progress = tasks.length === 0 ? 0 : Math.floor((tasksDone / tasks.length) * 100);

      return {
        ...project,
        progress,
      };
    });

    const totalPages = Math.ceil(totalResults / filter.limit);

    return {
      data,
      pagination: {
        total: totalPages,
        perPage: filter.limit,
        page: filter.page,
        hasNext: filter.page < totalPages,
        hasPrev: filter.page > 1,
      },
    };
  }

  async update(
    projectId: string,
    dto: UpdateProjectDto,
    orgId: string,
    userId: string,
  ) {
    const project = await this.verifyProjectOwnership(projectId, orgId);

    const updatedProject = await this.projectRepo.update({
      where: { id: project.id },
      data: dto,
    });

    void this.auditLogService.logAction({
      action: 'PROJECT_UPDATED',
      userId,
      organizationId: orgId,
      entityId: project.id,
      entityType: 'Project',
      metadata: { updatedFields: Object.keys(dto) },
    });

    return updatedProject;
  }
  async touch(
    projectId: string,
    dto: UpdateProjectDto,
    orgId: string,
    userId: string,
  ) {
    const project = await this.verifyProjectOwnership(projectId, orgId);

    const today = new Date()
    const todayLocal = today.toLocaleDateString('sv-SE');

    const updatedProject = await this.projectRepo.update({
      where: { id: project.id },
      data: {
        updatedAt: todayLocal,
      },
    });

    void this.auditLogService.logAction({
      action: 'PROJECT_UPDATED',
      userId,
      organizationId: orgId,
      entityId: project.id,
      entityType: 'Project',
      metadata: { updatedFields: Object.keys(dto) },
    });

    return updatedProject;
  }

  async delete(projectId: string, orgId: string, userId: string) {
    const project = await this.verifyProjectOwnership(projectId, orgId);

    await this.projectRepo.update({
      where: { id: project.id },
      data: {
        deletedAt: new Date(),
        status: EnumStatusProject.DELETE,
      },
    });

    void this.auditLogService.logAction({
      action: 'PROJECT_DELETE',
      userId,
      organizationId: orgId,
      entityId: project.id,
      entityType: 'Project',
    });

    return {
      message: 'Projeto deletado com sucesso',
    };
  }

  async changeStatus(
    projectId: string,
    orgId: string,
    userId: string,
    changeStatusDto: ChangeStatusDto,
  ) {
    const project = await this.verifyProjectOwnership(projectId, orgId);

    const { status } = changeStatusDto;

    await this.projectRepo.update({
      where: { id: project.id },
      data: {
        updatedAt: new Date(),
        status,
      },
    });

    void this.auditLogService.logAction({
      action: 'PROJECT_CHANGE_STATUS',
      userId,
      organizationId: orgId,
      entityId: project.id,
      entityType: 'Project',
    });

    return {
      message: 'Status do projeto atualizado com sucesso',
    };
  }

  async projectBelongsToOrganization(id: string, organizationId: string) {
    const owenr = await this.projectRepo.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    return owenr;
  }

  private async verifyProjectOwnership(projectId: string, orgId: string) {
    const project = await this.projectRepo.findUnique({
      where: { id: projectId },
    });

    if (
      !project ||
      project.organizationId !== orgId ||
      project.deletedAt !== null
    ) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return project;
  }
}
