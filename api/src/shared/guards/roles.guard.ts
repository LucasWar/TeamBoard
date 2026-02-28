import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { EnumRole, Membership } from '@prisma/client';

export interface MembershipRequest extends Request {
  membership: Membership;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Descobre quais roles a rota exige lendo o decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<MembershipRequest>();

    const membership = request.membership;

    if (!membership) {
      throw new ForbiddenException(
        'Associação com a organização não encontrada.',
      );
    }

    if (membership.role == EnumRole.ADMIN) {
      return true;
    }

    const hasRole = requiredRoles.includes(membership.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'Seu cargo não tem permissão para realizar esta ação.',
      );
    }

    return true;
  }
}
