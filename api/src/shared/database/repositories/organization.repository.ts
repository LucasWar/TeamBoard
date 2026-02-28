import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.OrganizationCreateArgs) {
    return this.prismaService.organization.create(createDto);
  }

  findUnique(findDto: Prisma.OrganizationFindUniqueArgs) {
    return this.prismaService.organization.findUnique(findDto);
  }

  findMany<T extends Prisma.OrganizationFindManyArgs>(
    findDto?: Prisma.SelectSubset<T, Prisma.OrganizationFindManyArgs>,
  ) {
    return this.prismaService.organization.findMany(findDto);
  }

  findFirst<T extends Prisma.OrganizationFindFirstArgs>(
    findDto: Prisma.SelectSubset<T, Prisma.OrganizationFindFirstArgs>,
  ) {
    return this.prismaService.organization.findFirst(findDto);
  }
}
