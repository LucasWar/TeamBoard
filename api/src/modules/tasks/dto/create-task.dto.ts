import { EnumPriority, EnumStatusTask } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(EnumStatusTask)
  @IsNotEmpty()
  status: EnumStatusTask;

  @IsEnum(EnumPriority)
  @IsNotEmpty()
  priority: EnumPriority;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
