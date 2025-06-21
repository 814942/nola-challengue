import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { PasswordRules } from 'src/commons/decorators/password-rules.decorator';

export class SignInUserRequestDTO {
  @ApiProperty({
    example: 'jon@housestark.com',
    required: true,
    uniqueItems: true
  })
  @IsEmail({}, { message: 'Tiene que ser un email valido.' })
  @IsNotEmpty({ message: 'email requerido.' })
  email: string;

  @ApiProperty({
    example: 'Win3r1sC0mm1nG!',
    required: true,
    minLength: 6,
    maxLength: 50
  })
  @IsString({ message: 'password debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'password requerida' })
  @PasswordRules()
  password: string;
}
