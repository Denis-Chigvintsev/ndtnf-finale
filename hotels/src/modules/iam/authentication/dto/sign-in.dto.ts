import { IsEmail, MinLength, IsString } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class SignInDto {
  @IsEmail()
  email: string;
  @MinLength(3)
  @IsString()
  password: string;
}
