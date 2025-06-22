import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up a user', async () => {
    mockAuthService.signUp.mockResolvedValue({ tokens: { accessToken: 'jwt-token' }, user: { email: 'test@mail.com' } });
    const result = await controller.signUpPlayer({ email: 'test@mail.com', password: '123456' });
    expect(result.tokens.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('test@mail.com');
  });

  it('should sign in a user', async () => {
    mockAuthService.signIn.mockResolvedValue({ tokens: { accessToken: 'jwt-token' }, user: { email: 'test@mail.com' } });
    const result = await controller.signIn({ email: 'test@mail.com', password: '123456' });
    expect(result.tokens.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('test@mail.com');
  });
});
