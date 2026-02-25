import { Prisma, PrismaClient } from '@prisma/client';

export class MembershipsRepository {
  constructor(private readonly prismaService: PrismaClient) {}

  create(createDto: Prisma.MembershipCreateArgs) {
    return this.prismaService.membership.create(createDto);
  }

  findUnique(findDto: Prisma.MembershipFindUniqueArgs) {
    return this.prismaService.membership.findUnique(findDto);
  }

  update(updateDto: Prisma.MembershipUpdateArgs) {
    return this.prismaService.membership.update(updateDto);
  }

  count(countDto: Prisma.MembershipCountArgs) {
    return this.prismaService.membership.count(countDto);
  }
}
