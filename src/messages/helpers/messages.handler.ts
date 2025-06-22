import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { LoggerService } from '../../logger/logger.service';
import { PubMessage } from '../interfaces/message.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagesHandler implements OnModuleInit {
  private redisPublisher: Redis;

  constructor(
    private readonly _logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    this._logger.setContext(MessagesHandler.name);
    this.redisPublisher = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
    });
  }

  onModuleInit() {
    this.subscribeToChannel('messages');
  }

  async publishMessage(payload: PubMessage) {
    await this.redisPublisher.publish('messages', JSON.stringify(payload));
  }

  private async subscribeToChannel(channel: string) {
    const subscriber = this.redisPublisher.duplicate();

    subscriber.on('message', async (channel, message) => {
      this._logger.log(`Received message from channel ${channel}`);
      this._logger.log(`Message received: ${message}`);
    });

    await subscriber.subscribe(channel, (err, count) => {
      if (err) {
        this._logger.error('Error subscribing:', err);
      } else {
        this._logger.log(`Subscribed to ${count} channel(s).`);
      }
    });
  }
}
