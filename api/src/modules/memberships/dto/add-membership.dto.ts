import { EnumRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddMembershipDTO {
  @IsString()
  @IsUUID()
  userId: string;

  @IsEnum(EnumRole)
  @IsNotEmpty()
  role: EnumRole;
}
