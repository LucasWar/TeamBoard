import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { AddMembershipDTO } from './dto/add-membership.dto';
import { CurrentOrg } from 'src/shared/decorators/current-organization.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationGuard } from 'src/shared/guards/organization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('memberships')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post('addMembership')
  create(
    @Body() addMembershipDto: AddMembershipDTO,
    @CurrentOrg() organizationId: string,
  ) {
    return this.membershipsService.addMembership(
      addMembershipDto,
      organizationId,
    );
  }

  @Post('confirmInvitation')
  async confirmeInvitation(
    @CurrentUser('userId') userId: string,
    @Body() body: { organizationId: string },
  ) {
    return await this.membershipsService.confirmInvitation(
      userId,
      body.organizationId,
    );
  }

  @Get()
  findAll() {
    return this.membershipsService.findAll();
  }

  // @Patch('roleUpdate/:id')
  // roleUpdate(@Param('id') id: string) {
  //   return this.membershipsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
  //   return this.membershipsService.update(+id, updateMembershipDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.membershipsService.remove(+id);
  // }
}
