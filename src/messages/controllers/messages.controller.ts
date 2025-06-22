import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { MessagesService } from '../services/messages.service';

import { AccessTokenGuard } from '../../commons/guards/access-token.guard';

import { AuthenticatedRequest } from '../../commons/interfaces/authenticated-request.interface';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async postMessage(
    @Body() body: { message: string; userId: string },
    @Req() req: AuthenticatedRequest
  ) {
    return this.messagesService.createMessage(req.user.id, body.message);
  }
}
