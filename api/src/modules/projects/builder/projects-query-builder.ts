import { Prisma } from '@prisma/client';
import { FilterProjectDto } from '../dto/filter-project.dto';

export class ProjectQueryBuilder {
  constructor(
    private readonly filters: FilterProjectDto,
    private orgId: string,
  ) {}

  private where: Prisma.ProjectWhereInput = {};
  private skip?: number;
  private take?: number;
  private orderBy?: Prisma.ProjectOrderByWithRelationInput;

  public build(): Prisma.ProjectFindManyArgs {
    this.withName();
    this.withStatus();
    this.withPagination();
    this.withSorting();

    this.where.deletedAt = {
      equals: null,
    };

    this.where.organizationId = {
      equals: this.orgId,
    };

    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
    };
  }

  private withPagination(): this {
    if (this.filters.page && this.filters.limit) {
      const page = Number(this.filters.page);
      const limit = Number(this.filters.limit);

      this.skip = (page - 1) * limit;
      this.take = limit;
    }

    return this;
  }

  private withSorting(): this {
    if (this.filters.sortBy) {
      this.orderBy = {
        [this.filters.sortBy]: this.filters.sort ?? 'asc',
      };
    }
    return this;
  }

  private withName(): this {
    if (this.filters.name) {
      this.where.name = {
        contains: this.filters.name,
        mode: 'insensitive',
      };
    }
    return this;
  }

  private withStatus(): this {
    if (this.filters.status) {
      this.where.status = {
        equals: this.filters.status,
      };
    }
    return this;
  }
}
