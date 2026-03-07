import { EnumStatusTask } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ReorderTaskDto {
  @IsEnum(EnumStatusTask)
  @IsNotEmpty()
  newStatus: EnumStatusTask;

  @IsNotEmpty()
  newPosition: number;
}
