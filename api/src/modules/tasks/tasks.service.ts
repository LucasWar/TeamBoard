import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from 'src/shared/database/repositories/tasks.repository';
import { ProjectsService } from '../projects/projects.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { MembershipsService } from '../memberships/memberships.service';
import { EnumStatusTask, Prisma } from '@prisma/client';
import { TransactionManager } from 'src/shared/database/transaction.manager';
import { ReorderTaskDto } from './dto/reorder-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
    const { assigneeEmail, ...dto } = createTaskDto;

    const project = await this.projectService.projectBelongsToOrganization(
      projectId,
      organizationId,
    );

    if (!project) {
      throw new NotFoundException('O projeto não pertence a esta organização');
    }

    let assigneeId: string | undefined;

    if (assigneeEmail) {
      assigneeId = await this.membershipService.verifyUserInOrgByEmail(
        assigneeEmail,
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
        ...dto,
        assigneeId,
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

  async delete(id: string, orgId: string) {
    const task = await this.taskRepo.findUnique({
      where: {
        id,
        organizationId: orgId,
      },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não econtrada');
    }

    await this.taskRepo.delete({
      where: {
        id,
      },
    });
  }

  async updateTask(
    taskId: string,
    dto: UpdateTaskDto,
    orgId: string,
    userId: string,
  ) {
    const { assigneeEmail, ...rest } = dto;

    let assigned: string | undefined;

    const task = await this.verifyTaskOwnership(taskId, orgId);

    if (!task) {
      throw new NotFoundException('A tarefa não pertence a sua organização');
    }

    if (assigneeEmail) {
      assigned = await this.membershipService.verifyUserInOrgByEmail(
        assigneeEmail,
        orgId,
      );

      if (!assigned) {
        throw new NotFoundException('Usuário atribuido a tarefa não existe');
      }
    }

    const user = await this.membershipService.getMembershipByUserAndOrg(
      userId,
      orgId,
    );

    if (!user) {
      throw new NotFoundException('Você não pertence a essa organização');
    }

    await this.taskRepo.update({
      where: {
        id: taskId,
      },
      data: {
        ...rest,
        assigneeId: assigned,
      },
    });
  }

  async assignTask(
    taskId: string,
    assigneeId: string,
    orgId: string,
    userId: string,
  ) {
    const task = await this.verifyTaskOwnership(taskId, orgId);

    await this.membershipService.verifyUserInOrg(assigneeId, orgId);

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
        assignee: {
          select: { id: true, name: true, avatar: true, email: true },
        },
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

  async myTasks(userId: string, orgId: string) {
    const today = new Date();

    // remove horas/minutos/segundos
    today.setHours(0, 0, 0, 0);

    const result = await this.taskRepo.findMany({
      where: {
        OR: [{ status: 'IN_PROGRESS' }, { status: 'TODO' }],
        organizationId: orgId,
        assigneeId: userId,

        project: {
          status: 'ACTIVE',
        },
      },

      omit: {
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        organizationId: true,
        projectId: true,
        position: true,
      },
    });

    const grouped = {
      late: [] as typeof result,
      today: [] as typeof result,
      upcoming: [] as typeof result,
    };

    for (const task of result) {
      // tarefas sem data
      if (!task.dueDate) {
        grouped.upcoming.push(task);
        continue;
      }

      const dueDate = new Date(task.dueDate);

      // normaliza data
      dueDate.setHours(0, 0, 0, 0);

      // atrasadas
      if (dueDate < today) {
        grouped.late.push(task);
        continue;
      }

      // hoje
      if (dueDate.getTime() === today.getTime()) {
        grouped.today.push(task);
        continue;
      }

      // futuras
      grouped.upcoming.push(task);
    }

    return grouped;
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

      const data: Prisma.TaskUncheckedUpdateInput = {
        status: dto.newStatus,
        position: dto.newPosition,
      };

      if (
        dto.newStatus === EnumStatusTask.DONE &&
        dto.newStatus != dto.oldStatus
      ) {
        data.completedAt = new Date();
      } else {
        data.completedAt = null;
      }

      return this.taskRepo.update({
        where: { id: taskId },
        data,
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
