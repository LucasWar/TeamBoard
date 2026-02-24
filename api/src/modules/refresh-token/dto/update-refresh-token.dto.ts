import { PartialType } from '@nestjs/mapped-types';
import { CreateRefreshTokenDto } from '../../../shared/dto/create-refresh-token.dto';

export class UpdateRefreshTokenDto extends PartialType(CreateRefreshTokenDto) {}
