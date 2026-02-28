// src/shared/interceptors/audit.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from 'src/modules/audit-log/audit-log.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Ignoramos GET, pois não queremos logar 1 milhão de requisições de leitura
    if (method === 'GET') {
      return next.handle();
    }

    // Usamos o operador 'tap' do RxJS para executar código DEPOIS que a requisição deu sucesso
    return next.handle().pipe(
      tap(() => {
        const user = request.user;
        const orgId = request.headers['x-organization-id'];

        this.auditLogService.logAction({
          action: `AUTO_${method}_REQUEST`,
          userId: user?.userId,
          organizationId: orgId,
          metadata: {
            url: request.originalUrl,
            body: request.body // Cuidado com senhas aqui! No mundo real, filtramos dados sensíveis.
          },
          ipAddress: request.ip,
        });
      }),
    );
  }
}