import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      client.emit('unauthorized', 'Token is required');
      client.disconnect();
      return false;
    }

    try {
      const tokenPayload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('tokens.access'),
      });
      client.data.user = tokenPayload;
      return true;
    } catch {
      client.disconnect();
      return false;
    }
  }
}