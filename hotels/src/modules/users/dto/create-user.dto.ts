import { Optional } from '@nestjs/common';

export class CreateUserDto {
  @Optional()
  id?: string;

  name: string;

  email: string;

  password: string; /// hashed

  @Optional()
  contactPhone?: string;

  @Optional()
  role?: string = 'client';
}
