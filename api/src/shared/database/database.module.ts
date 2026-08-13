import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TransactionManager } from './transaction.manager';
import { OrganizationRepository } from './repositories/organization.repository';
import { MembershipsRepository } from './repositories/membership.repository';
import { AuditLogRepository } from './repositories/audit-log.repository copy';
import { TasksRepository } from './repositories/tasks.repository';
import { ProjectsRepository } from './repositories/projects.repository';
import { CommentsRepository } from './repositories/comments.repository';
import { NotificationsRepository } from './repositories/notifications.repository';

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
    AuditLogRepository,
    TasksRepository,
    ProjectsRepository,
    CommentsRepository,
    NotificationsRepository,
  ],
  exports: [
    UserRepository,
    RefreshTokenRepository,
    AuthRepository,
    TransactionManager,
    OrganizationRepository,
    MembershipsRepository,
    AuditLogRepository,
    TasksRepository,
    ProjectsRepository,
    CommentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
