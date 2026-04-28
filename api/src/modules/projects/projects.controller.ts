import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { OrganizationGuard } from 'src/shared/guards/organization.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { CurrentOrg } from 'src/shared/decorators/current-organization.decorator';
import { FilterProjectDto } from './dto/filter-project.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, OrganizationGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.projectsService.create(createProjectDto, orgId, userId);
  }

  @Get()
  findAll(@Query() filter: FilterProjectDto, @CurrentOrg() orgId: string) {
    return this.projectsService.findAllByOrg(orgId, filter);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  update(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.projectsService.update(
      projectId,
      updateProjectDto,
      orgId,
      userId,
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  delte(
    @Param('id') projectId: string,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.projectsService.delete(projectId, orgId, userId);
  }

  @Patch('changeStatus/:id')
  @Roles('ADMIN', 'MENAGER')
  changeStatus(
    @Body() changeStatusDto: ChangeStatusDto,
    @Param('id') projectId: string,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.projectsService.changeStatus(
      projectId,
      orgId,
      userId,
      changeStatusDto,
    );
  }
}
