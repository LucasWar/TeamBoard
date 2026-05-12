import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUser } from 'src/shared/interfaces/auth-user.interface';
import { CurrentOrg } from 'src/shared/decorators/current-organization.decorator';
import type { CurrentOrgId } from 'src/shared/interfaces/current-org-id';
import { ChangeTaskStatusDto } from './dto/change-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationGuard } from 'src/shared/guards/organization.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('myKips')
  myKips(@CurrentOrg() orgId: string, @CurrentUser('userId') userId: string) {
    return this.tasksService.myKpis(userId, orgId);
  }

  @Get('myTasks')
  myTasks(@CurrentOrg() orgId: string, @CurrentUser('userId') userId: string) {
    return this.tasksService.myTasks(userId, orgId);
  }

  @Get('recentTasksByPriority')
  getRecentTasksByPriority(
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.tasksService.getRecentTasksByPriority(userId, orgId);
  }

  @Post(':id/create')
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('id') projectId: string,
    @CurrentUser() user: AuthUser,
    @CurrentOrg() organizationId: string,
  ) {
    return this.tasksService.create(
      createTaskDto,
      organizationId,
      user.userId,
      projectId,
    );
  }

  @Get('project/:idProject')
  findAll(
    @Param('idProject') projectId: string,
    @CurrentOrg() organizationId: CurrentOrgId,
  ) {
    return this.tasksService.findAllByProject(
      projectId,
      organizationId.currentOrgId,
    );
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') taskId: string,
    @Body() dto: ChangeTaskStatusDto,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.tasksService.changeStatus(taskId, dto.status, orgId, userId);
  }

  @Patch(':id')
  updateTaks(
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.tasksService.updateTask(taskId, dto, orgId, userId);
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
