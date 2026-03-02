import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenRepository } from 'src/shared/database/repositories/refresh-token.repository';
import { TransactionManager } from 'src/shared/database/transaction.manager';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  const mockRefreshTokenRepo = {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  };

  const mockTransactionManager = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: RefreshTokenRepository, useValue: mockRefreshTokenRepo },
        { provide: TransactionManager, useValue: mockTransactionManager },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo refresh token calculando a data de expiração', async () => {
      const createDto = {
        tokenHash: 'hash_super_secreto_123',
        userId: 'user-id-999',
      };

      mockRefreshTokenRepo.create.mockResolvedValue(undefined);

      await service.create(createDto);

      expect(mockRefreshTokenRepo.create).toHaveBeenCalledTimes(1);

      expect(mockRefreshTokenRepo.create).toHaveBeenCalledWith({
        data: {
          tokenHash: 'hash_super_secreto_123',
          userId: 'user-id-999',
          expiresAt: expect.any(Date) as unknown as Date,
        },
      });
    });
  });
});
