import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationGuard } from 'src/shared/guards/organization.guard';
import { CurrentOrg } from 'src/shared/decorators/current-organization.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.commentsService.create(taskId, createCommentDto, orgId, userId);
  }

  @Get()
  findAllByTask(@Param('taskId') taskId: string, @CurrentOrg() orgId: string) {
    return this.commentsService.findAllByTask(taskId, orgId);
  }
}
