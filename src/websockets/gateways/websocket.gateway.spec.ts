import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { LoggerService } from '../../logger/logger.service';

describe('WebsocketsGateway', () => {
  let gateway: WebsocketsGateway;
  const mockJwtService = {
    verify: jest.fn((token: string) => ({ email: 'test@example.com' })),
  };
  const mockConfigService = {
    get: jest.fn(() => 'secret'),
  };
  const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketsGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    gateway = module.get<WebsocketsGateway>(WebsocketsGateway);
  });

  // afterAll(async () => {
  //   if (clientSocket && clientSocket.connected) clientSocket.disconnect();
  //   ioServer.close();
  //   httpServer.close();
  //   await app.close();
  // });

  it('should emit "Bienvenido {usuario}" on connect with valid token', async () => {
    const emit = jest.fn();
    const disconnect = jest.fn();
    const client: any = {
      id: 'testid',
      handshake: { headers: { authorization: 'Bearer validtoken' } },
      emit,
      disconnect,
      data: {},
    };

    await gateway.handleConnection(client as any);

    expect(emit).toHaveBeenCalledWith('message', 'Bienvenido test@example.com');
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('should disconnect client if token is missing', async () => {
    const emit = jest.fn();
    const disconnect = jest.fn();
    const client: any = {
      id: 'testid',
      handshake: { headers: {} },
      emit,
      disconnect,
      data: {},
    };

    await gateway.handleConnection(client as any);

    expect(disconnect).toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalledWith('message', expect.anything());
  });

  it('should disconnect client if token is invalid', async () => {
    mockJwtService.verify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const emit = jest.fn();
    const disconnect = jest.fn();
    const client: any = {
      id: 'testid',
      handshake: { headers: { authorization: 'Bearer invalidtoken' } },
      emit,
      disconnect,
      data: {},
    };

    await gateway.handleConnection(client as any);

    expect(disconnect).toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalledWith('message', expect.anything());
  });

  it('should emit "pong" on "ping"', () => {
    const emit = jest.fn();
    const client: any = {
      id: 'testid',
      emit,
      data: { user: { email: 'test@example.com' } },
    };

    gateway.handlePing(client as any);

    expect(emit).toHaveBeenCalled();
    const [event, message] = emit.mock.calls[0];
    expect(event).toBe('pong');
    expect(message).toMatch(/^pong /);
  });
});