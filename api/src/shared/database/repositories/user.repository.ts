import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDto);
  }

  update(updateDto: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(updateDto);
  }

  findMany<T extends Prisma.UserFindManyArgs>(
    findDto: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>,
  ) {
    return this.prismaService.user.findMany(findDto);
  }

  findUnique<T extends Prisma.UserFindUniqueArgs>(
    findDto: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
  ) {
    return this.prismaService.user.findUnique(findDto);
  }

  findFirst<T extends Prisma.UserFindFirstArgs>(
    findDto: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>,
  ) {
    return this.prismaService.user.findFirst(findDto);
  }
}
