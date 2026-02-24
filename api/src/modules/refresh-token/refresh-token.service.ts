import { Injectable } from '@nestjs/common';
import { CreateRefreshTokenDto } from '../../shared/dto/create-refresh-token.dto';
//import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
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

  async revoke(id: string) {
    return this.refreshTokenRepo.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async rotate(
    oldTokenId: string,
    createRefreshTokenDto: CreateRefreshTokenDto,
  ) {
    const { tokenHash, userId } = createRefreshTokenDto;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return this.transactionManager.transaction(async (tx) => {
      const newToken = await this.refreshTokenRepo.create(
        {
          data: { tokenHash, userId, expiresAt },
        },
        tx,
      );

      await this.refreshTokenRepo.update(
        {
          where: { id: oldTokenId },
          data: {
            revokedAt: new Date(),
            replacedByTokenId: newToken.id,
          },
        },
        tx,
      );

      return newToken;
    });
  }
}
