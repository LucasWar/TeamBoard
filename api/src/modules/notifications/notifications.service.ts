import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsRepository } from 'src/shared/database/repositories/notifications.repository';
import { UsersService } from '../users/users.service';
import { EnumRole } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepo: NotificationsRepository,
    private readonly userService: UsersService,
  ) {}

  async createInvitationNotification(
    recipientEmail: string,
    role: EnumRole,
    organizationName: string,
    organizationId: string,
  ) {
    const user = await this.userService.findOneByEmail(recipientEmail);

    if (!user) {
      throw new NotFoundException('Usuário não encontado');
    }

    const sendMenssage = `Caro(a) ${user.name}, foi lhe enviado um convite para participar da organização: ${organizationName} como ${role}`;

    await this.notificationRepo.create({
      data: {
        menssage: sendMenssage,
        organizationId,
        type: 'INVITING',
        user: {
          connect: user,
        },
      },
    });
  }

  async findAll(userId: string) {
    return await this.notificationRepo.findMany({
      where: {
        userId,
        read: false,
      },
      select: {
        menssage: true,
        type: true,
        read: true,
        organizationId: true,
        id: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
