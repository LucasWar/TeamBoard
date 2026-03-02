import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService } from './audit-log.service';
import { AuditLogRepository } from 'src/shared/database/repositories/audit-log.repository copy';

describe('AuditLogService', () => {
  let service: AuditLogService;

  const mockAuditLogRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        { provide: AuditLogRepository, useValue: mockAuditLogRepository },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it('logAction', async () => {
    const fakerLog = {
      action: 'LOGIN',
      entityType: 'USER',
      entityId: '1',
      metadata: { email: 'lucas@gmail.com' },
      organizationId: '1',
      userId: '1',
    };

    mockAuditLogRepository.create.mockReturnValue(fakerLog);

    const result = await service.logAction(fakerLog);

    expect(result).toEqual(fakerLog);
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
      data: {
        action: fakerLog.action,
        entityType: fakerLog.entityType,
        entityId: fakerLog.entityId,
        metadata: fakerLog.metadata,
        organizationId: fakerLog.organizationId,
        userId: fakerLog.userId,
      },
    });
    expect(mockAuditLogRepository.create).toHaveBeenCalledTimes(1);
  });
});
