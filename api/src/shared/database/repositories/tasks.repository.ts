import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.TaskCreateArgs) {
    return this.prismaService.task.create(createDto);
  }

  findUnique(findDto: Prisma.TaskFindUniqueArgs) {
    return this.prismaService.task.findUnique(findDto);
  }

  delete(deleteDto: Prisma.TaskDeleteArgs) {
    return this.prismaService.task.delete(deleteDto);
  }

  findFirst(findDto: Prisma.TaskFindFirstArgs) {
    return this.prismaService.task.findFirst(findDto);
  }

  groupBy<T extends Prisma.TaskGroupByArgs>(findDto: T) {
    return this.prismaService.task.groupBy(findDto as any);
  }

  async getRecentTasksByPriority(userId: string, orgId: string) {
    return this.prismaService.$queryRaw`
      SELECT 
        t.title AS "taskTitle", 
        t.due_date AS "dueDate", 
        t.priority, 
        p.name AS "projectName"
      FROM "Task" t
      INNER JOIN "Project" p ON t.project_id = p.id
      WHERE t.organization_id = ${orgId}::uuid
        AND t.assignee_id = ${userId}::uuid
        AND p.status = 'ACTIVE'
        AND t.status NOT IN ('DONE', 'BLOCKED')
        AND t.deleted_at IS NULL
      ORDER BY 
        CASE t.priority
          WHEN 'URGENT' THEN 1
          WHEN 'HIGH'   THEN 2
          WHEN 'MEDIUM' THEN 3
          WHEN 'LOW'    THEN 4
          ELSE 5
        END ASC,
        t.due_date ASC
      LIMIT 6
    `;
  }

  findMany(findDto?: Prisma.TaskFindManyArgs) {
    return this.prismaService.task.findMany(findDto);
  }

  update(updateDto: Prisma.TaskUpdateArgs) {
    return this.prismaService.task.update(updateDto);
  }

  updateMany(updateDto: Prisma.TaskUpdateManyArgs) {
    return this.prismaService.task.updateMany(updateDto);
  }

  count(countDto: Prisma.TaskCountArgs) {
    return this.prismaService.task.count(countDto);
  }
}
