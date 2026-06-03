import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CommentsModule } from './modules/comments/comments.module';
import { RedisModule } from './modules/redis/redis.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IdempotencyInteceptor } from './shared/interceptors/idempotency-key.interceptor';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    RefreshTokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrganizationsModule,
    MembershipsModule,
    AuditLogModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInteceptor,
    },
  ],
})
export class AppModule {}
