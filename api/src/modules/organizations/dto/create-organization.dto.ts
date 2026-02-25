import { EnumPlan } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EnumPlan)
  @IsNotEmpty()
  plan: EnumPlan;
}
