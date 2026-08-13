import { NotificationType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  menssage!: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type!: NotificationType;

  @IsString()
  @IsNotEmpty()
  emailUser!: string;
}
