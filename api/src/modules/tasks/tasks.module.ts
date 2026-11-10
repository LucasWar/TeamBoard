import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from '../projects/projects.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { TaskGateway } from './task.gateway';
import { MembershipsModule } from '../memberships/memberships.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ProjectsModule, OrganizationsModule, MembershipsModule, JwtModule],
  controllers: [TasksController],
  providers: [TasksService, TaskGateway],
  exports: [TasksService],
})
export class TasksModule {}
