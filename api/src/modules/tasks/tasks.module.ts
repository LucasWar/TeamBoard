import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from '../projects/projects.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [ProjectsModule, OrganizationsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
