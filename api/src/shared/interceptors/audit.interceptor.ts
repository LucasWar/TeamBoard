import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from 'src/modules/audit-log/audit-log.service';
import { AuthUser } from '../interfaces/auth-user.interface';
import type { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const method = request.method;

    if (method === 'GET') {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const user = request.user;
        const orgId = request.headers['x-organization-id'] as
          | string
          | undefined;

        void this.auditLogService.logAction({
          action: `AUTO_${method}_REQUEST`,
          userId: user?.userId,
          organizationId: orgId,
          metadata: {
            url: request.originalUrl,
            body: request.body as unknown,
          },
          ipAddress: request.ip,
        });
      }),
    );
  }
}
