import { Prisma, PrismaClient } from '@prisma/client';

export class MembershipsRepository {
  constructor(private readonly prismaService: PrismaClient) {}

  create(createDto: Prisma.MembershipCreateArgs) {
    return this.prismaService.membership.create(createDto);
  }
}
