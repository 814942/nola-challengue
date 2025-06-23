import { Module } from '@nestjs/common';

import { MessagesController } from './controllers/messages.controller';

import { MessagesService } from './services/messages.service';

import { MessagesHandler } from './helpers/messages.handler';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesHandler,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('isProduction');

        if (isProduction) {
          const redisUrl = configService.get<string>('redis.url')!;
          return new Redis(redisUrl);
        }

        const host = configService.get<string>('redis.host');
        const port = configService.get<number>('redis.port');
        return new Redis({ host, port });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class MessagesModule {}
