import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IdempotencyInteceptor } from 'src/shared/interceptors/idempotency-key.interceptor';

@Module({
  controllers: [UsersController],
  providers: [UsersService, IdempotencyInteceptor],
  exports: [UsersService],
})
export class UsersModule {}
