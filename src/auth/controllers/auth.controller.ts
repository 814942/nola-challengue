import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';

import { SignInUserRequestDTO } from '../dtos/request/sign-in-user.request.dto';
import { AuthUserResponseDTO } from '../dtos/response/auth-user.response.dto';
import { SignUpUserRequestDTO } from '../dtos/request/sign-up-user.request.dto';

@ApiTags('Seguridad y autentificacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUpPlayer(@Body() signUpBody: SignUpUserRequestDTO): Promise<AuthUserResponseDTO> {
    return await this.authService.signUp(signUpBody);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.ACCEPTED)
  async signIn(@Body() signUpBody: SignInUserRequestDTO): Promise<AuthUserResponseDTO> {
    return this.authService.signIn(signUpBody);
  }
}
