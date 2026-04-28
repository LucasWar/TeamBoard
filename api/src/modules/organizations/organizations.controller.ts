import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
//import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AuthUser } from 'src/shared/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationGuard } from 'src/shared/guards/organization.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { CurrentOrg } from 'src/shared/decorators/current-organization.decorator';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user: AuthUser | undefined,
  ) {
    return this.organizationsService.create(createOrganizationDto, user);
  }

  @Get()
  @Roles('USER')
  @UseGuards(OrganizationGuard, RolesGuard)
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get('summary')
  @UseGuards(OrganizationGuard, RolesGuard)
  sumarryDashboard(
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.organizationsService.sumarryDashboard(orgId, userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.organizationsService.findOne(+id);
  // }

  // @Patch(':id')
  // @Roles('ADMIN')
  // @UseGuards(OrganizationGuard, RolesGuard)
  // update(
  //   @Param('id') id: string,
  //   @Body() updateOrganizationDto: UpdateOrganizationDto,
  // ) {
  //   return this.organizationsService.update(+id, updateOrganizationDto);
  // }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.organizationsService.remove(id, userId);
  }
}
