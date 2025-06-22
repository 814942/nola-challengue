import { Injectable } from '@nestjs/common';

import { MessagesHandler } from '../helpers/messages.handler';
import { PubMessage } from '../interfaces/message.interface';

@Injectable()
export class MessagesService {
  private messages: PubMessage[] = [];

  constructor(private readonly messagesHandler: MessagesHandler) {}

  async createMessage(userId: number, message: string) {
    const msg: PubMessage = {
      userId,
      message,
      timestamp: new Date().toISOString(),
    };

    this.messages.push(msg);

    await this.messagesHandler.publishMessage(msg);

    return msg;
  }

  getMessages() {
    return this.messages;
  }
}
