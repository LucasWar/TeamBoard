import { EnumPriority, EnumStatusTask } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsEnum(EnumPriority)
  @IsNotEmpty()
  priority!: EnumPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEmail()
  @IsOptional()
  assigneeEmail?: string;
}
