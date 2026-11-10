import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';
import { RefreshTokenService } from '../../refresh-token/refresh-token.service';
import { CreateRefreshTokenDto } from 'src/shared/dto/create-refresh-token.dto';
import { RegisterDto } from '../dto/login.dto copy';
import { AuditLogService } from 'src/modules/audit-log/audit-log.service';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

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

    await this.auditLogService.logAction({
      action: 'USER_LOGIN',
      userId: user.id,
      metadata: { email: user.email },
    });

    return tokens;
  }

  async register(registerDto: RegisterDto) {
    const newUser = await this.userService.create(
      registerDto.email,
      registerDto.name,
      registerDto.password,
      registerDto.avatar,
    );
    const tokens = await this.generateTokens(newUser.id, newUser.email);

    const refreshTokenDto: CreateRefreshTokenDto = {
      tokenHash: this.hashToken(tokens.refreshToken),
      userId: newUser.id,
    };

    await this.refreshTokenService.create(refreshTokenDto);

    await this.auditLogService.logAction({
      action: 'USER_LOGIN',
      userId: newUser.id,
      metadata: { email: newUser.email },
    });

    return tokens;
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      refreshToken,
      { secret: process.env.JWT_REFRESH_SECRET },
    );

    if (!payload) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    const hashToken = this.hashToken(refreshToken);

    const tokenRegister = await this.refreshTokenService.findbyHash(hashToken);

    if (!tokenRegister) {
      await this.auditLogService.logAction({
        action: 'REFRESH_TOKEN',
        metadata: {
          error: 'INVALID_TOKEN',
          userId: payload.sub,
        },
      });
      throw new BadRequestException('Token invalido');
    }

    if (tokenRegister.revokedAt) {
      throw new UnauthorizedException('Token ja revogado');
    }

    const tokens = await this.generateTokens(payload.sub, payload.email);

    await this.refreshTokenService.rotate(
      hashToken,
      this.hashToken(tokens.refreshToken),
    );

    return tokens;
  }

  async rovokedToken(token: string | undefined) {
    if (!token) {
      throw new NotFoundException('Token não enviado');
    }

    const hashToken = this.hashToken(token);

    await this.refreshTokenService.revoke(hashToken);
  }

  private async generateTokens(userId: string, email: string) {
    const jti = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15min',
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
}
