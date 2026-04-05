import { EnumStatusProject } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterProjectDto {
  @IsOptional()
  @IsString()
  page?: number;

  @IsOptional()
  @IsString()
  limit?: number;

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
