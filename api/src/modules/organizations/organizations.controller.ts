import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AuthUser } from 'src/shared/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationGuard } from 'src/shared/guards/organization.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { CurrentOrg } from 'src/shared/decorators/current-organization.decorator';
import { AddMemberDTO } from './dto/add-member';
import { FilterOrganizationDto } from './dto/filter-organization.dto';
import { IdempotencyInteceptor } from 'src/shared/interceptors/idempotency-key.interceptor';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @UseInterceptors(IdempotencyInteceptor)
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user: AuthUser | undefined,
  ) {
    return this.organizationsService.create(createOrganizationDto, user);
  }

  @Get('summary')
  @UseGuards(OrganizationGuard)
  sumarryDashboard(
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.organizationsService.sumarryDashboard(orgId, userId);
  }

  @Get('organizationUserId')
  orgazanitionsUser(
    @Query() filters: FilterOrganizationDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.organizationsService.listOrganizationByUserId(userId, filters);
  }

  @Get('members')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  listMembers(
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.organizationsService.listMembers(orgId, userId);
  }

  @Delete(':id')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.organizationsService.remove(id, userId);
  }

  @Post('addMember')
  @UseGuards(OrganizationGuard, RolesGuard)
  @UseInterceptors(IdempotencyInteceptor)
  @Roles('ADMIN')
  addMember(
    @Body() addMembershipDto: AddMemberDTO,
    @CurrentOrg() orgId: string,
  ) {
    return this.organizationsService.AddMember(addMembershipDto, orgId);
  }
}
