import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface CurrentOrgId extends Request {
  currentOrgId: string;
}

export const CurrentOrg = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<CurrentOrgId>();

    return request.currentOrgId;
  },
);
