import { IsEmail, MinLength } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class SignInDto {
  @IsEmail()
  email: string;
  @MinLength(3)
  password: string;
}
