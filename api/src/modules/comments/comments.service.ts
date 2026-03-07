import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { AuditLogService } from 'src/modules/audit-log/audit-log.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    taskId: string,
    dto: CreateCommentDto,
    orgId: string,
    userId: string,
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId: orgId, // O cadeado mestre!
        deletedAt: null,
      },
    });

    if (!task) {
      throw new NotFoundException(
        'Tarefa não encontrada ou não pertence a esta organização.',
      );
    }

    const comment = await this.prisma.comment.create({
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
    return this.prisma.comment.findMany({
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
