import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger();
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.client = createClient({
        url: this.configService.getOrThrow<string>('REDIS_URL'),

        socket: {
          reconnectStrategy(retries, cause) {
            if (retries > 10) {
              return new Error('Redis: limite de reconexões atingido');
            }

            return Math.min(retries * 500, 5000);
          },
        },
      });

      await this.client.connect();
      this.logger.log('Sucess connection Redis Serve');
    } catch (error) {
      this.logger.error('Connection to Redis failed');
    }
  }

  async getResponse(idempontencyKey: string) {
    return await this.client.get(idempontencyKey);
  }

  async setResponse(idempontencyKey: string, body: string) {
    return await this.client.set(idempontencyKey, body, {
      NX: true,
      EX: 1 * 60 * 60,
    });
  }
}
