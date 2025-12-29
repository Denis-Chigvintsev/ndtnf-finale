import { Optional } from '@nestjs/common';

export class UpdateUserDto {
  @Optional()
  id: string;

  @Optional()
  name: string;

  @Optional()
  email: string;

  @Optional()
  password: string; /// hashed

  @Optional()
  contactPhone?: string;

  @Optional()
  role?: string;
}
