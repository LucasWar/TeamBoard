import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { MembershipsModule } from '../memberships/memberships.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MembershipsModule, UsersModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
