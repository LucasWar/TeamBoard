import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from 'src/modules/audit-log/audit-log.service';
import { AuthUser } from '../interfaces/auth-user.interface';
import type { Request } from 'express';
import { TasksRepository } from '../database/repositories/tasks.repository';

@Injectable()
export class TesteInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly taskRepo: TasksRepository,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const method = request.method;

    if (method === 'GET' || method === 'DELETE') {
      return next.handle();
    }

    console.log('antes da execução');

    return next.handle().pipe(
      tap(() => {
        console.log('Apos a excecução');
      }),
    );
  }
}
