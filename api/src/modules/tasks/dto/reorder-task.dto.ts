import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { EnumStatusTask } from '@prisma/client';

export class ReorderTaskDto {
  @IsEnum(EnumStatusTask)
  @IsNotEmpty()
  newStatus!: EnumStatusTask;

  @IsEnum(EnumStatusTask)
  @IsNotEmpty()
  oldStatus!: EnumStatusTask;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  newPosition!: number;
}
