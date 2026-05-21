import { Prisma } from '@prisma/client';
import { FilterOrganizationDto } from '../dto/filter-organization.dto';

export class OrganizationQueryBuilder {
  constructor(private readonly filters: FilterOrganizationDto) {}

  private where: Prisma.OrganizationWhereInput = {};
  private skip?: number;
  private take?: number;
  private orderBy?: Prisma.OrganizationOrderByWithRelationInput;

  public build(): Prisma.OrganizationFindManyArgs {
    this.withName();
    this.withPagination();
    this.withSorting();

    this.where.deletedAt = {
      equals: null,
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
}
