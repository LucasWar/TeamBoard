import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRefreshTokenDto } from '../../shared/dto/create-refresh-token.dto';
import { RefreshTokenRepository } from 'src/shared/database/repositories/refresh-token.repository';
import { TransactionManager } from 'src/shared/database/transaction.manager';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly transactionManager: TransactionManager,
  ) {}

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    const { tokenHash, userId } = createRefreshTokenDto;
    await this.refreshTokenRepo.create({
      data: {
        tokenHash,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async findbyHash(tokenHash: string) {
    return await this.refreshTokenRepo.findFirst({
      where: {
        tokenHash,
      },
    });
  }

  async revoke(tokenHash: string) {
    const token = await this.refreshTokenRepo.findFirst({
      where: {
        tokenHash,
      },
    });

    if (!token) {
      throw new NotFoundException('Token não encontrado');
    }

    await this.refreshTokenRepo.update({
      where: { id: token.id },
      data: { revokedAt: new Date() },
    });
  }

  async rotate(tokenHash: string, newHashToken: string) {
    await this.refreshTokenRepo.update({
      where: {
        tokenHash,
      },
      data: {
        tokenHash: newHashToken,
        lastUsedAt: new Date(),
      },
    });
  }
}
