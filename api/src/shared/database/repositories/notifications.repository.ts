import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDto: Prisma.NotificationCreateArgs) {
    return await this.prismaService.notification.create(createDto);
  }

  findUnique(findDto: Prisma.NotificationFindUniqueArgs) {
    return this.prismaService.notification.findUnique(findDto);
  }

  findMany<T extends Prisma.NotificationFindManyArgs>(
    findDto?: Prisma.SelectSubset<T, Prisma.NotificationFindManyArgs>,
  ) {
    return this.prismaService.notification.findMany(findDto);
  }

  findFirst<T extends Prisma.NotificationFindFirstArgs>(
    findDto: Prisma.SelectSubset<T, Prisma.NotificationFindFirstArgs>,
  ) {
    return this.prismaService.notification.findFirst(findDto);
  }
}
