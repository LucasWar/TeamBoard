import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionManager {
  constructor(private readonly prismaService: PrismaService) {}

  async transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prismaService.$transaction(callback);
  }

  async withTx<T>(
    tx: Prisma.TransactionClient | undefined,
    callback: (trx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    if (tx) {
      // Já estamos dentro de uma transação existente
      return callback(tx);
    }

    // Criamos uma nova transação
    return this.prismaService.$transaction(async (trx) => {
      return callback(trx);
    });
  }
}
