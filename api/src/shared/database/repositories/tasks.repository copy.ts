import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ProjectCreateArgs) {
    return this.prismaService.project.create(createDto);
  }

  findUnique(findDto: Prisma.ProjectFindUniqueArgs) {
    return this.prismaService.project.findUnique(findDto);
  }

  findMany(findDto: Prisma.ProjectFindManyArgs) {
    return this.prismaService.project.findMany(findDto);
  }

  findFirst(findDto: Prisma.ProjectFindFirstArgs) {
    return this.prismaService.project.findFirst(findDto);
  }

  update(updateDto: Prisma.ProjectUpdateArgs) {
    return this.prismaService.project.update(updateDto);
  }

  count(countDto: Prisma.ProjectCountArgs) {
    return this.prismaService.project.count(countDto);
  }
}
