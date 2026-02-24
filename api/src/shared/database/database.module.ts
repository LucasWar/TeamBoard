import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';

import { AuthRepository } from './repositories/auth.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TransactionManager } from './transaction.manager';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    RefreshTokenRepository,
    AuthRepository,
    TransactionManager,
  ],
  exports: [
    UserRepository,
    RefreshTokenRepository,
    AuthRepository,
    TransactionManager,
  ],
})
export class DatabaseModule {}
