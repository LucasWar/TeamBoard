import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditLogService } from 'src/modules/audit-log/audit-log.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { TasksService } from '../tasks/tasks.service';
import { CommentsRepository } from 'src/shared/database/repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepo: CommentsRepository,
    private readonly taskService: TasksService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    taskId: string,
    dto: CreateCommentDto,
    orgId: string,
    userId: string,
  ) {
    const task = await this.taskService.findTaskByTaskIsOrganizationId(
      taskId,
      orgId,
    );

    if (!task) {
      throw new NotFoundException(
        'Tarefa não encontrada ou não pertence a esta organização.',
      );
    }

    const comment = await this.commentRepo.create({
      data: {
        content: dto.content,
        taskId: task.id,
        authorId: userId,
        organizationId: orgId,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    void this.auditLogService.logAction({
      action: 'COMMENT_CREATED',
      userId,
      organizationId: orgId,
      entityId: comment.id,
      entityType: 'Comment',
      metadata: {
        taskId: task.id,
        contentPreview: dto.content.substring(0, 40),
      },
    });

    return comment;
  }

  async findAllByTask(taskId: string, orgId: string) {
    return this.commentRepo.findMany({
      where: {
        taskId,
        organizationId: orgId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }
}
