import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { WebsocketsGateway } from './gateways/websockets.gateway';

import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('tokens.access'),
        signOptions: { expiresIn: "1d" }
      }),
    }),
    ConfigModule
  ],
  providers: [WebsocketsGateway, WsJwtGuard],
})
export class WebsocketsModule {}
