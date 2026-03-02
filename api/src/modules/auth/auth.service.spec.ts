import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './services/auth.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');
describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    sign: jest.fn(),
  };

  const mockRefreshTokenService = {
    create: jest.fn(),
  };

  const mockAuditLogService = {
    logAction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUserService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: AuditLogService, useValue: mockAuditLogService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto = { email: 'lucas@gmail.com', password: 'senha_real_123' };
    it('deve realizar o login com sucesso e retornar os tokens', async () => {
      const userFaker = {
        id: 'user-id-123',
        email: 'lucas@gmail.com',
        passwordHash: 'hash_do_banco',
        isActive: true,
        emailVerified: true,
      };
      mockUserService.findOneByEmail.mockResolvedValue(userFaker);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const tokensFalsos = { accessToken: 'token_A', refreshToken: 'token_R' };
      jest.spyOn(service, 'generateTokens').mockResolvedValue(tokensFalsos);

      jest
        .spyOn(service as any, 'hashToken')
        .mockReturnValue('hash_do_refresh_token');

      const result = await service.login(loginDto);

      expect(result).toEqual(tokensFalsos);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'senha_real_123',
        'hash_do_banco',
      );

      expect(mockRefreshTokenService.create).toHaveBeenCalledWith({
        tokenHash: 'hash_do_refresh_token',
        userId: 'user-id-123',
      });

      expect(mockAuditLogService.logAction).toHaveBeenCalledWith({
        action: 'USER_LOGIN',
        userId: 'user-id-123',
        metadata: { email: 'lucas@gmail.com' },
      });
    });

    it('Usuário não esta ativo', async () => {
      const userFaker = {
        id: 'user-id-123',
        email: 'lucas@gmail.com',
        passwordHash: 'hash_do_banco',
        isActive: false,
        emailVerified: true,
      };
      mockUserService.findOneByEmail.mockResolvedValue(userFaker);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Usuário não tem email verificado', async () => {
      const userFaker = {
        id: 'user-id-123',
        email: 'lucas@gmail.com',
        passwordHash: 'hash_do_banco',
        isActive: true,
        emailVerified: false,
      };
      mockUserService.findOneByEmail.mockResolvedValue(userFaker);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('deve realizar o cadastro de um novo usuário', async () => {
      const registerDto = {
        email: 'lucas@gmail.com',
        password: 'senha_real_123',
        name: 'lucas cliente',
        avatar: 'avatar.png',
      };

      const userFaker = {
        id: 'user-id-123',
        email: 'lucas@gmail.com',
        passwordHash: 'hash_do_banco',
        isActive: true,
        emailVerified: true,
      };

      mockUserService.create.mockResolvedValue(userFaker);

      const newUser = await service.register(registerDto);

      expect(newUser).toEqual(userFaker);

      expect(mockUserService.create).toHaveBeenCalledWith(
        'lucas@gmail.com',
        'lucas cliente',
        'senha_real_123',
        'avatar.png',
      );
    });
  });
});
