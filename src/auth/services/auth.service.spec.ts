import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';

import { UsersService } from '../../users/services/users.service';

import { LoggerService } from '../../logger/logger.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(() => true),
  genSalt: jest.fn(() => Promise.resolve('salt')),
  hash: jest.fn(() => Promise.resolve('hashed')),
}));

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };
  const mockConfigService = {
    get: jest.fn(() => 'secret'),
  };
  const mockLoggerService = {
    setContext: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user and return tokens', async () => {
    mockUsersService.createUser.mockResolvedValue({ id: 1, email: 'test@mail.com', password: '123456' });
    jest.spyOn(service as any, 'getTokens').mockResolvedValue({ accessToken: 'jwt-token' });

    const result = await service.signUp({ email: 'test@mail.com', password: '123456' });
    expect(result.tokens.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('test@mail.com');
  });

  it('should sign in a user and return tokens', async () => {
    mockUsersService.findUserByEmail.mockResolvedValue({ id: 1, email: 'test@mail.com', password: 'hashed' });
    jest.spyOn(service as any, 'getTokens').mockResolvedValue({ accessToken: 'jwt-token' });

    const result = await service.signIn({ email: 'test@mail.com', password: '123456' });
    expect(result.tokens.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('test@mail.com');
  });
});
