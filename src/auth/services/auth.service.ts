import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';

import { LoggerService } from '../../logger/logger.service';

import { AuthTokensDTO, AuthUserDTO, AuthUserResponseDTO } from '../dtos/response/auth-user.response.dto';
import { SignInUserRequestDTO } from '../dtos/request/sign-in-user.request.dto';
import { SignUpUserRequestDTO } from '../dtos/request/sign-up-user.request.dto';

import { User } from '../../users/entities/user.entity';

import { UsersService } from '../../users/services/users.service';

import { isCodeMatching } from '../helpers/is-code-matching';
import { hashPassword } from '../helpers/hash-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly _logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this._logger.setContext(AuthService.name);
  }

  private async getTokens(userData: User): Promise<AuthTokensDTO> {
    const payload = {
      id: userData.id,
      email: userData.email,
      createdAt: userData.createdAt.toISOString(),
      iat: Math.floor(Date.now() / 1000),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('tokens.access'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('tokens.refresh'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async validateUserPassword(currentPassword: string, storedPassword: string) {
    const passwordMatches = await isCodeMatching(currentPassword, storedPassword);
    if (!passwordMatches) {
      throw new HttpException('Contraseña incorrecta.', HttpStatus.NOT_ACCEPTABLE);
    }

    return passwordMatches;
  }

  async signUp(userSignUpBody: SignUpUserRequestDTO): Promise<AuthUserResponseDTO> {
    this._logger.log('Registrando usuario');
    this._logger.log('Hashing password...');
    const hashedPassword = await hashPassword(userSignUpBody.password);

    const userCreated = await this.usersService.createUser(
      {
        email: userSignUpBody.email,
        password: hashedPassword,
      }
    );

    const userTokens = await this.getTokens(userCreated);

    const userPlain = instanceToPlain(userCreated);
    const authUserDTO = new AuthUserDTO();
    Object.assign(authUserDTO, userPlain);

    this._logger.log('Usuario registrado exitosamente');
    return {
      tokens: userTokens,
      user: authUserDTO,
    };
  }

  async signIn(UserSignUpBody: SignInUserRequestDTO): Promise<AuthUserResponseDTO> {
      this._logger.log('Iniciando sesión');
      const userFound = await this.usersService.findUserByEmail(
        UserSignUpBody.email,
      );
      console.log("🚀 ~ AuthService ~ signIn ~ userFound:", userFound)

      await this.validateUserPassword(UserSignUpBody.password, userFound.password);

      const userTokens = await this.getTokens(userFound);

      const userPlain = instanceToPlain(userFound) as AuthUserDTO;
      const authUserDTO = new AuthUserDTO();
      Object.assign(authUserDTO, userPlain);

      this._logger.log('Sesión iniciada exitosamente');
      return {
        tokens: userTokens,
        user: authUserDTO,
      };
  }
}
