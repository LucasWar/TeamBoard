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

  findFirst(findDto: Prisma.TaskFindFirstArgs) {
    return this.prismaService.task.findFirst(findDto);
  }

  findMany(findDto: Prisma.TaskFindManyArgs) {
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
