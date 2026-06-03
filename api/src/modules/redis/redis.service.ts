import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    try {
      this.client = createClient({
        url: 'redis://localhost:6379',
      });

      await this.client.connect();
      console.log('Sucesso ao conectar');
    } catch (error) {
      console.log('Erro ao tentar conectar com o redis');
      console.log(`Error: ${error}`);
    }
  }

  getClient() {
    return this.client;
  }
}
