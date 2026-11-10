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
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepo: TasksRepository,
    private readonly projectService: ProjectsService,
    private readonly membershipService: MembershipsService,
    private readonly auditLogService: AuditLogService,
    private readonly transactionManager: TransactionManager,
    private readonly eventEmitter: EventEmitter2,
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
      omit: {
        assigneeId: true,
        completedAt: true,
        createdAt: true,
        deletedAt: true,
        updatedAt: true,
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

    this.eventEmitter.emit('task.created', newTask);

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

    this.eventEmitter.emit('task.deleted', task.projectId, id);
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

    const newTask = await this.taskRepo.update({
      where: {
        id: taskId,
      },
      data: {
        ...rest,
        assigneeId: assigned,
      },
    });

    this.eventEmitter.emit('task.updated', newTask);
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
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );

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
      if (!task.dueDate) {
        grouped.upcoming.push(task);
        continue;
      }

      if (task.dueDate < today) {
        grouped.late.push(task);
        continue;
      }

      if (task.dueDate.getTime() === today.getTime()) {
        grouped.today.push(task);
        continue;
      }

      grouped.upcoming.push(task);
    }

    return grouped;
  }

  async myKpis(userId: string, orgId: string) {
    const now = new Date();

    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const lastSevenDays = new Date(todayUTC);
    lastSevenDays.setUTCDate(lastSevenDays.getUTCDate() - 7);

    const result = await this.taskRepo.findMany({
      where: {
        OR: [{ status: 'IN_PROGRESS' }, { status: 'TODO' }],
        organizationId: orgId,
        assigneeId: userId,
        dueDate: {
          lte: now,
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
          lte: now,
        },
      },
    });

    const contagem = result.reduce(
      (acc, { dueDate }) => {
        if (dueDate!.getTime() === todayUTC.getTime()) {
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

    const result = await this.transactionManager.transaction(async (tx) => {
      const currentTask = await tx.task.findUniqueOrThrow({
        where: { id: taskId },
      });

      const oldStatus = currentTask.status;
      const oldPosition = currentTask.position!;
      const newStatus = dto.newStatus;

      const taskCountInNewStatus = await tx.task.count({
        where: {
          projectId: task.projectId,
          status: newStatus,
          id: { not: taskId },
        },
      });

      const maxPosition =
        oldStatus === newStatus ? taskCountInNewStatus : taskCountInNewStatus;

      const newPosition = Math.max(0, Math.min(dto.newPosition, maxPosition));

      if (oldStatus === newStatus) {
        if (newPosition < oldPosition) {
          // Moveu para cima
          await tx.task.updateMany({
            where: {
              projectId: task.projectId,
              status: newStatus,
              position: {
                gte: newPosition,
                lt: oldPosition,
              },
              id: {
                not: taskId,
              },
            },
            data: {
              position: {
                increment: 1,
              },
            },
          });
        } else if (newPosition > oldPosition) {
          // Moveu para baixo
          await tx.task.updateMany({
            where: {
              projectId: task.projectId,
              status: newStatus,
              position: {
                gt: oldPosition,
                lte: newPosition,
              },
              id: {
                not: taskId,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        }
        // newPosition === oldPosition: nada a fazer
      } else {
        /**
         * =========================================================
         * 2. TROCOU DE COLUNA
         * =========================================================
         */
        await tx.task.updateMany({
          where: {
            projectId: task.projectId,
            status: oldStatus,
            position: {
              gt: oldPosition,
            },
            id: {
              not: taskId,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        await tx.task.updateMany({
          where: {
            projectId: task.projectId,
            status: newStatus,
            position: {
              gte: newPosition,
            },
            id: {
              not: taskId,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      const data: Prisma.TaskUncheckedUpdateInput = {
        status: newStatus,
        position: newPosition,
      };

      if (
        newStatus === EnumStatusTask.DONE &&
        oldStatus !== EnumStatusTask.DONE
      ) {
        data.completedAt = new Date();
      } else if (
        newStatus !== EnumStatusTask.DONE &&
        oldStatus === EnumStatusTask.DONE
      ) {
        data.completedAt = null;
      }

      return tx.task.update({
        where: {
          id: taskId,
        },
        data,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
            },
          },
        },
      });
    });

    const affectedTasks = await this.taskRepo.findMany({
      where: {
        projectId: task.projectId,
        status: {
          in:
            dto.oldStatus === result.status
              ? [result.status]
              : [dto.oldStatus, result.status],
        },
      },
      orderBy: [
        {
          status: 'asc',
        },
        {
          position: 'asc',
        },
      ],
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    /**
     * =========================================================
     * 5. EMITE EVENTO PARA OS OUTROS CLIENTES
     * =========================================================
     */
    this.eventEmitter.emit('tasks.reordered', {
      projectId: task.projectId,
      movedTask: result,
      tasks: affectedTasks,
    });

    return result;
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
