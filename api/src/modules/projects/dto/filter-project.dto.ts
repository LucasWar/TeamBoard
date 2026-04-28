import { EnumStatusProject } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterProjectDto {
  @IsNotEmpty()
  @IsString()
  page!: number;

  @IsOptional()
  @IsString()
  limit!: number;

  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(EnumStatusProject)
  status?: EnumStatusProject;

  @IsOptional()
  @IsString()
  name?: string;
}
