import { EnumRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AddMemberDTO {
  @IsString()
  @IsEmail()
  email!: string;

  @IsEnum(EnumRole)
  @IsNotEmpty()
  role!: EnumRole;
}
