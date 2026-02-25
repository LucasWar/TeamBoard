import { Prisma, PrismaClient } from '@prisma/client';

export class OrganizationRepository {
  constructor(private readonly prismaService: PrismaClient) {}

  create(createDto: Prisma.OrganizationCreateArgs) {
    return this.prismaService.organization.create(createDto);
  }

  findUnique(findDto: Prisma.OrganizationFindUniqueArgs) {
    return this.prismaService.organization.findUnique(findDto);
  }

  findMany(findDto: Prisma.OrganizationFindManyArgs) {
    return this.prismaService.organization.findMany(findDto);
  }
}
