import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthUser } from '../interfaces/auth-user.interface';
import type { Request } from 'express';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class IdempotencyInteceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const redis = this.redisService.getClient();
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const method = request.method;

    if (method === 'GET' || method === 'DELETE') {
      return next.handle();
    }

    const idempotencyKey = request.headers['x-idempotency-key'] as
      | string
      | undefined;

    if (!idempotencyKey) {
      throw new BadRequestException(
        'Chave de idempotencia necessária para essa requisição',
      );
    }

    const cachedResponse = await redis.get(idempotencyKey);

    if (cachedResponse) {
      return of({
        idempotencyKey: idempotencyKey,
        ...JSON.parse(cachedResponse),
      });
    }

    return next.handle().pipe(
      tap((data) => {
        void redis.set(idempotencyKey, JSON.stringify(data), {
          expiration: {
            type: 'EX',
            value: 3600,
          },
        });
      }),
    );
  }
}
