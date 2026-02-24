import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';
import { RefreshTokenService } from '../../refresh-token/refresh-token.service';
import { CreateRefreshTokenDto } from 'src/shared/dto/create-refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Sua conta foi desativada. Entre em contato com o suporte.',
      );
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Por favor, confirme seu e-mail antes de fazer o login.',
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const refreshTokenDto: CreateRefreshTokenDto = {
      tokenHash: this.hashToken(tokens.refreshToken),
      userId: user.id,
    };

    await this.refreshTokenService.create(refreshTokenDto);

    return tokens;
  }

  async generateTokens(userId: string, email: string) {
    const jti = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, jti },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokens = await this.generateTokens(payload.sub, '');

      return tokens;
    } catch {
      throw new UnauthorizedException('Refresh inválido');
    }
  }
}
