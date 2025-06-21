import { ApiProperty } from "@nestjs/swagger"
import { Exclude, Type } from "class-transformer"
import { IsBase64, IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator"

export class AuthTokensDTO {
	@ApiProperty({
    example: 'thisIsMyAccessToken'
  })
	@IsString()
	@IsNotEmpty()
	@IsBase64()
	accessToken: string

	@ApiProperty({
    example: 'thisIsMyRefreshToken'
  })
	@IsString()
	@IsNotEmpty()
	@IsBase64()
	refreshToken: string
}

export class AuthUserDTO {
	@ApiProperty({
    example: 'jon@housestark.com',
    uniqueItems: true
  })
	@IsEmail()
	@IsNotEmpty()
  email: string

  @Exclude()
  password: string
}

export class AuthUserResponseDTO {
	@ApiProperty()
	@ValidateNested()
	user: AuthUserDTO

	@ApiProperty()
	@ValidateNested()
	tokens: AuthTokensDTO
}