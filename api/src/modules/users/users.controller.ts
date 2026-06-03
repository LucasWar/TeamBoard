import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from 'src/shared/interfaces/auth-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { IdempotencyInteceptor } from 'src/shared/interceptors/idempotency-key.interceptor';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseInterceptors(IdempotencyInteceptor)
  async me(@CurrentUser() user: AuthUser) {
    return await this.usersService.findOneById(user.userId);
  }

  @Get('myOrganizations')
  async myOrganizations(@CurrentUser() user: AuthUser) {
    return await this.usersService.getMyOrganizationsById(user.userId);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':email')
  // findOne(@Param('email') id: string) {
  //   return this.usersService.findOneByEmail(id);
  // }

  @Patch()
  update(@CurrentUser() user: AuthUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto, user.userId);
  }

  @Patch('changePassword')
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body() changeUserDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(changeUserDto, user.userId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
