import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'O comentário não pode ser vazio' })
  @MaxLength(1000, { message: 'O comentário excedeu o limite de caracteres' })
  content: string;
}
