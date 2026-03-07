import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
  findAll(@CurrentOrg() orgId: string) {
    return this.projectsService.findAllByOrg(orgId);
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
  @Roles('ADMIN') // 👈 Arquivar/Deletar é exclusividade do ADMIN
  archive(
    @Param('id') projectId: string,
    @CurrentOrg() orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.projectsService.archive(projectId, orgId, userId);
  }
}
