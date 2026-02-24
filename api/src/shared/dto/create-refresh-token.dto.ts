import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  tokenHash: string;
}
