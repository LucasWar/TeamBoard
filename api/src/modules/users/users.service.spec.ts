import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from 'src/shared/database/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt');
describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  const mockUserRepository = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneByEmail', () => {
    it('deve retornar um usuário quando o email existir', async () => {
      const userFake = {
        id: '1',
        email: 'teste@gmail.com',
        password: '123456789',
        name: 'Dev',
      };

      mockUserRepository.findUnique.mockResolvedValue(userFake);

      const result = await service.findOneByEmail('teste@gmail.com');

      expect(result).toEqual(userFake);
      expect(jest.spyOn(repository, 'findUnique')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(repository, 'findUnique')).toHaveBeenCalledWith({
        where: { email: 'teste@gmail.com' },
      });
    });

    it('deve retornar null quando o usuário não for encontrado', async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);

      const result = await service.findOneByEmail('inexistente@gmail.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const mockDto = {
      email: 'novo@gmail.com',
      name: 'Novo User',
      password: 'senha_super_secreta',
      avatar: 'http://avatar.com/foto.jpg',
    };

    it('deve criar um novo usuário com sucesso e criptografar a senha', async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue('senha_hasheada_fake');

      const userCriado = {
        id: '123',
        email: mockDto.email,
        name: mockDto.name,
        avatar: mockDto.avatar,
      };
      mockUserRepository.create.mockResolvedValue(userCriado);

      const result = await service.create(
        mockDto.email,
        mockDto.name,
        mockDto.password,
        mockDto.avatar,
      );

      expect(result).toEqual(userCriado);

      expect(bcrypt.hash).toHaveBeenCalledWith('senha_super_secreta', 10);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        data: {
          name: mockDto.name,
          email: mockDto.email,
          passwordHash: 'senha_hasheada_fake',
          avatar: mockDto.avatar,
        },
        omit: {
          passwordHash: true,
        },
      });
    });

    it('deve lançar um ConflictException se o email já estiver cadastrado', async () => {
      mockUserRepository.findUnique.mockResolvedValue({
        id: '999',
        email: mockDto.email,
      });

      (bcrypt.hash as jest.Mock).mockClear();

      await expect(
        service.create(
          mockDto.email,
          mockDto.name,
          mockDto.password,
          mockDto.avatar,
        ),
      ).rejects.toThrow(ConflictException);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
