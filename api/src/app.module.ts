import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    RefreshTokenModule,
    ConfigModule.forRoot({
      isGlobal: true, // 👈 MUITO importante
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
