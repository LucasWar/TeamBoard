import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('logs')
export class AuditLogController {
  constructor(private readonly auditLogServ: AuditLogService) {}

  @Get(':id')
  async findMany(@Param('id') logId: string) {
    return await this.auditLogServ.findByID(logId);
  }
}
