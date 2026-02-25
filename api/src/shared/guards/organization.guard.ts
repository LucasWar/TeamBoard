import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Membership } from '@prisma/client';
import { MembershipsService } from 'src/modules/memberships/memberships.service';
import { AuthUser } from '../interfaces/auth-user.interface';

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
  currentOrgId: string;
  membership: Membership;
}

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly membershipsService: MembershipsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    const orgId = request.headers['x-organization-id'] as string;

    if (!orgId) {
      throw new BadRequestException(
        'O cabeçalho x-organization-id é obrigatório.',
      );
    }

    const membership = await this.membershipsService.getMembershipByUserAndOrg(
      user.userId,
      orgId,
    );

    if (!membership || membership.status !== 'ACTIVE') {
      throw new ForbiddenException('Você não tem acesso a esta organização.');
    }

    request.currentOrgId = orgId;
    request.membership = membership;

    return true;
  }
}
