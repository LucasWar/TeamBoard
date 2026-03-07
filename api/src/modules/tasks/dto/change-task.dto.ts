import { EnumStatusTask } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeTaskStatusDto {
  @IsEnum(EnumStatusTask)
  @IsNotEmpty()
  status: EnumStatusTask;
}
