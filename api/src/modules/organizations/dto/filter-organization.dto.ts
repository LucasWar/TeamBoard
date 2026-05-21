import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterOrganizationDto {
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
  @IsString()
  name?: string;
}
