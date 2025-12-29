/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Optional } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(3)
  @IsString()
  password: string;

  @Optional()
  @IsString()
  contactPhone?: string;

  @Optional()
  @IsString()
  role?: string = 'client';
}
