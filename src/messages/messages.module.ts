import { Module } from '@nestjs/common';

import { MessagesController } from './controllers/messages.controller';

import { MessagesService } from './services/messages.service';

import { MessagesHandler } from './helpers/messages.handler';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesHandler],
})
export class MessagesModule {}
