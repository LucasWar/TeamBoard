import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentOrgId } from '../interfaces/current-org-id';

export const CurrentOrg = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<CurrentOrgId>();

    return request.currentOrgId;
  },
);
