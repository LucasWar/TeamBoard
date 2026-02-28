import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/shared/database/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(email: string, name: string, password: string, avatar: string) {
    const uniqueEmail = await this.findOneByEmail(email);

    if (uniqueEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.userRepo.create({
      data: {
        name,
        email,
        passwordHash,
        avatar,
      },
      omit: {
        passwordHash: true,
      }
    });

    return newUser;
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  async findOneById(id: string) {
    const user = await this.userRepo.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
