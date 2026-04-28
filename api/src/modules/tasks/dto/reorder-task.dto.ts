import { EnumStatusTask } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class ReorderTaskDto {
  @IsEnum(EnumStatusTask)
  @IsNotEmpty()
  newStatus!: EnumStatusTask;

  @IsEnum(EnumStatusTask)
  @IsOptional()
  oldStatus?: EnumStatusTask;

  @IsNotEmpty()
  newPosition!: number;
}
