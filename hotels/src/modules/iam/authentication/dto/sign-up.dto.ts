/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(3)
  @IsString()
  password: string;

  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  role?: string = 'client';
}
