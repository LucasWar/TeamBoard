import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
