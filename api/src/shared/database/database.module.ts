import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TransactionManager } from './transaction.manager';
import { OrganizationRepository } from './repositories/organization.repository';
import { MembershipsRepository } from './repositories/membership.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    RefreshTokenRepository,
    AuthRepository,
    TransactionManager,
    OrganizationRepository,
    MembershipsRepository,
  ],
  exports: [
    UserRepository,
    RefreshTokenRepository,
    AuthRepository,
    TransactionManager,
    OrganizationRepository,
    MembershipsRepository,
  ],
})
export class DatabaseModule {}
