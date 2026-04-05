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

@Injectable()
export class ProjectsService {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly projectRepo: ProjectsRepository,
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

    const projects = await this.projectRepo.findMany({
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
    });

    return projects.map(({ tasks, ...project }) => {
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

  async archive(projectId: string, orgId: string, userId: string) {
    const project = await this.verifyProjectOwnership(projectId, orgId);

    await this.projectRepo.update({
      where: { id: project.id },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    });

    void this.auditLogService.logAction({
      action: 'PROJECT_ARCHIVED',
      userId,
      organizationId: orgId,
      entityId: project.id,
      entityType: 'Project',
    });

    return { message: 'Projeto arquivado com sucesso' };
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
