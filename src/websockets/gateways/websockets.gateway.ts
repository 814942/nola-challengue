import {
  WebSocketGateway,
  OnGatewayConnection,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { WsJwtGuard } from '../guards/ws-jwt.guard';

import { LoggerService } from '../../logger/logger.service';

@WebSocketGateway()
export class WebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly _logger: LoggerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this._logger.setContext(WebsocketsGateway.name);
  }

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    this._logger.log(`Socket connected: ${client.id}`)
    const token = client.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('tokens.access'),
      });

      client.emit('message', `Bienvenido ${payload.email}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    this._logger.log(`Socket disconnected: ${client.id}`)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    const timestamp = new Date().toISOString();
    client.emit('pong', `pong ${timestamp}`);
  }
}