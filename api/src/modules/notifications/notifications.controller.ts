import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post()
  // @HttpCode(200)
  // async create(@Body() createNotificationDto: CreateNotificationDto) {
  //   await this.notificationsService.create(createNotificationDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser('userId') userId: string) {
    return this.notificationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
