import { Injectable, Logger } from '@nestjs/common';
import { AuditLogRepository } from 'src/shared/database/repositories/audit-log.repository copy';
import { CreateAuditLogDto } from 'src/shared/dto/create-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogRepo: AuditLogRepository) {}
  private readonly logger = new Logger(AuditLogService.name);

  async logAction(createAuditLogDto: CreateAuditLogDto) {
    const { action, entityId, entityType, metadata, organizationId, userId } =
      createAuditLogDto;
    try {
      const log = await this.auditLogRepo.create({
        data: {
          action,
          entityType,
          entityId,
          metadata,
          organizationId,
          userId,
        },
      });
      return log;
    } catch (error) {
      const errorTrace = error instanceof Error ? error.stack : String(error);

      this.logger.error(
        `Falha ao gravar AuditLog: ${createAuditLogDto.action}`,
        errorTrace,
      );
    }
  }
}
