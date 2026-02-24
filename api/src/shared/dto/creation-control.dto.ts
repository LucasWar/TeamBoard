import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreationControlDto {
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  updateAt: Date;

  @IsDateString()
  @IsNotEmpty()
  deleteAt?: Date;
}
