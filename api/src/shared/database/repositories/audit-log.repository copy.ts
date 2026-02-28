import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class AuditLogRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.AuditLogCreateArgs) {
    return this.prismaService.auditLog.create(createDto);
  }

  findUnique(findDto: Prisma.AuditLogFindUniqueArgs) {
    return this.prismaService.auditLog.findUnique(findDto);
  }

  update(updateDto: Prisma.AuditLogUpdateArgs) {
    return this.prismaService.auditLog.update(updateDto);
  }

  count(countDto: Prisma.AuditLogCountArgs) {
    return this.prismaService.auditLog.count(countDto);
  }
}
