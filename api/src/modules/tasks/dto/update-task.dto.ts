import { EnumPriority } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assigneeEmail?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(EnumPriority)
  @IsOptional()
  priority?: EnumPriority;
}
