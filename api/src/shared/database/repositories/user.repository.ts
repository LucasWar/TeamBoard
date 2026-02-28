import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDto);
  }

  findUnique(findDto: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(findDto);
  }
}
