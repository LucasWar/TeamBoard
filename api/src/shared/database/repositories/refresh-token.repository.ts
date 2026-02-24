import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prismaService;
  }

  create(
    createDto: Prisma.RefreshTokenCreateArgs,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).refreshToken.create(createDto);
  }

  update(
    updateDto: Prisma.RefreshTokenUpdateArgs,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).refreshToken.update(updateDto);
  }

  findFirst(
    findFirstDto: Prisma.RefreshTokenFindFirstArgs,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).refreshToken.findFirst(findFirstDto);
  }
}
