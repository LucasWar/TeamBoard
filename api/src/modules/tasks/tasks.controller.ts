import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUser } from 'src/shared/interfaces/auth-user.interface';
import { CurrentOrg } from 'src/shared/decorators/current-organization.decorator';
import type { CurrentOrgId } from 'src/shared/interfaces/current-org-id';
import { ChangeTaskStatusDto } from './dto/change-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':id/cretae')
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('id') projectId: string,
    @CurrentUser() user: AuthUser,
    @CurrentOrg() organizationId: CurrentOrgId,
  ) {
    return this.tasksService.create(
      createTaskDto,
      organizationId.currentOrgId,
      user.userId,
      projectId,
    );
  }

  @Get('projects/:id/task')
  findAll(
    @Param('id') projectId: string,
    @CurrentOrg() organizationId: CurrentOrgId,
  ) {
    return this.tasksService.findAllByProject(
      projectId,
      organizationId.currentOrgId,
    );
  }

  @Patch('tasks/:id/status')
  changeStatus(
    @Param('id') taskId: string,
    @Body() dto: ChangeTaskStatusDto,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.tasksService.changeStatus(taskId, dto.status, orgId, userId);
  }

  @Patch(':id/assign/:assigneeId')
  assignTask(
    @Param('id') taskId: string,
    @Param('assigneeId') assigneeId: string,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.tasksService.assignTask(taskId, assigneeId, orgId, userId);
  }

  @Patch(':id/reorder')
  reorder(
    @Param('id') taskId: string,
    @Body() dto: ReorderTaskDto,
    @CurrentOrg() orgId: string,
  ) {
    return this.tasksService.reorderTask(taskId, dto, orgId);
  }
}
