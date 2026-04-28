import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from 'src/shared/database/repositories/tasks.repository';
import { ProjectsService } from '../projects/projects.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { MembershipsService } from '../memberships/memberships.service';
import { EnumStatusTask, Prisma } from '@prisma/client';
import { TransactionManager } from 'src/shared/database/transaction.manager';
import { ReorderTaskDto } from './dto/reorder-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepo: TasksRepository,
    private readonly projectService: ProjectsService,
    private readonly membershipService: MembershipsService,
    private readonly auditLogService: AuditLogService,
    private readonly transactionManager: TransactionManager,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    organizationId: string,
    reporterId: string,
    projectId: string,
  ) {
    const project = await this.projectService.projectBelongsToOrganization(
      projectId,
      organizationId,
    );

    if (!project) {
      throw new NotFoundException('O projeto não pertence a esta organização');
    }

    if (createTaskDto.assigneeId) {
      await this.membershipService.verifyUserInOrg(
        createTaskDto.assigneeId,
        organizationId,
      );
    }
    const lastTask = await this.taskRepo.findFirst({
      where: { projectId, status: EnumStatusTask.TODO },
      orderBy: { position: 'desc' },
    });

    const nextPosition = lastTask?.position != null ? lastTask.position + 1 : 0;

    const newTask = await this.taskRepo.create({
      data: {
        ...createTaskDto,
        organizationId,
        reporterId,
        projectId,
        position: nextPosition,
      },
    });

    void this.auditLogService.logAction({
      action: 'TASK_CREATED',
      userId: reporterId,
      organizationId,
      entityId: newTask.id,
      entityType: 'Task',
      metadata: { title: newTask.title },
    });

    return newTask;
  }

  async assignTask(
    taskId: string,
    assigneeId: string,
    orgId: string,
    userId: string,
  ) {
    const task = await this.verifyTaskOwnership(taskId, orgId);

    await this.membershipService.verifyUserInOrg(assigneeId, orgId); // Garante que não é de fora

    const updatedTask = await this.taskRepo.update({
      where: { id: taskId },
      data: { assigneeId },
    });

    void this.auditLogService.logAction({
      action: 'TASK_ASSIGNED',
      userId,
      organizationId: orgId,
      entityId: task.id,
      entityType: 'Task',
      metadata: { assigneeId },
    });

    return updatedTask;
  }

  async findAllByProject(projectId: string, organizationId: string) {
    return await this.taskRepo.findMany({
      where: { projectId, organizationId, deletedAt: null },
      orderBy: { position: 'asc' }, // Essencial para o Kanban renderizar certo
      omit: {
        assigneeId: true,
        completedAt: true,
        createdAt: true,
        deletedAt: true,
        updatedAt: true,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async countTasksByStatus(orgId: string) {
    const result = await this.taskRepo.groupBy({
      by: ['status'],
      where: {
        organizationId: orgId,
        deletedAt: null,
      },
      _count: {
        status: true,
      },
    });

    return result;
  }

  async myKpis(userId: string, orgId: string) {
    const today = new Date();

    const todayLocal = today.toLocaleDateString('sv-SE');

    const lastSevenDays = new Date();
    lastSevenDays.setDate(today.getDate() - 7);
    lastSevenDays.setHours(0, 0, 0, 0);

    const result = await this.taskRepo.findMany({
      where: {
        OR: [{ status: 'IN_PROGRESS' }, { status: 'TODO' }],
        organizationId: orgId,
        assigneeId: userId,
        dueDate: {
          lte: today,
        },
        project: {
          status: 'ACTIVE',
        },
      },
    });

    const lastSevenDaysKpis = await this.taskRepo.findMany({
      where: {
        status: 'DONE',
        organizationId: orgId,
        assigneeId: userId,
        completedAt: {
          gte: lastSevenDays,
          lte: today,
        },
      },
    });

    const contagem = result.reduce(
      (acc, { dueDate }) => {
        const dataTarefaLocal = new Date(dueDate!).toLocaleDateString('sv-SE');

        if (dataTarefaLocal === todayLocal) {
          acc.forToday++;
        } else {
          acc.late++;
        }

        return acc;
      },
      { forToday: 0, late: 0 },
    );

    return {
      ...contagem,
      complets: lastSevenDaysKpis.length,
    };
  }

  async getRecentTasksByPriority(userId: string, orgId: string) {
    const tasks = await this.taskRepo.getRecentTasksByPriority(userId, orgId);

    return tasks;
  }

  async findTaskByTaskIsOrganizationId(taskId: string, organizationId: string) {
    return await this.taskRepo.findFirst({
      where: {
        id: taskId,
        organizationId: organizationId,
        deletedAt: null,
      },
    });
  }

  async reorderTask(taskId: string, dto: ReorderTaskDto, orgId: string) {
    const task = await this.verifyTaskOwnership(taskId, orgId);

    return this.transactionManager.transaction(async (tx) => {
      await this.taskRepo.updateMany({
        where: {
          projectId: task.projectId,
          status: dto.newStatus,
          position: { gte: dto.newPosition },
          id: { not: taskId },
        },
        data: {
          position: { increment: 1 },
        },
      });

      if (dto.oldStatus && dto.oldStatus != dto.newStatus) {
        await this.taskRepo.updateMany({
          where: {
            projectId: task.projectId,
            status: dto.oldStatus,
            position: { gt: dto.newPosition },
            id: { not: taskId },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      }

      return tx.task.update({
        where: { id: taskId },
        data: {
          status: dto.newStatus,
          position: dto.newPosition,
        },
      });
    });
  }

  async changeStatus(
    taskId: string,
    newStatus: EnumStatusTask,
    orgId: string,
    userId: string,
  ) {
    const task = await this.verifyTaskOwnership(taskId, orgId);

    const data: Prisma.TaskUncheckedUpdateInput = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (newStatus === 'DONE') {
      data.completedAt = new Date();
    } else {
      data.completedAt = null;
    }

    const updatedTask = await this.taskRepo.update({
      where: { id: taskId },
      data,
    });

    void this.auditLogService.logAction({
      action: 'TASK_STATUS_CHANGED',
      userId,
      organizationId: orgId,
      entityId: task.id,
      entityType: 'Task',
      metadata: { oldStatus: task.status, newStatus },
    });

    return updatedTask;
  }

  private async verifyTaskOwnership(taskId: string, orgId: string) {
    const task = await this.taskRepo.findFirst({
      where: { id: taskId, organizationId: orgId, deletedAt: null },
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada.');
    return task;
  }
}
