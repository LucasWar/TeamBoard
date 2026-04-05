import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.CommentCreateArgs) {
    return this.prismaService.comment.create(createDto);
  }

  findUnique(findDto: Prisma.CommentFindUniqueArgs) {
    return this.prismaService.comment.findUnique(findDto);
  }

  findMany<T extends Prisma.CommentFindManyArgs>(
    findDto?: Prisma.SelectSubset<T, Prisma.CommentFindManyArgs>,
  ) {
    return this.prismaService.comment.findMany(findDto);
  }

  findFirst<T extends Prisma.CommentFindFirstArgs>(
    findDto: Prisma.SelectSubset<T, Prisma.CommentFindFirstArgs>,
  ) {
    return this.prismaService.comment.findFirst(findDto);
  }
}
