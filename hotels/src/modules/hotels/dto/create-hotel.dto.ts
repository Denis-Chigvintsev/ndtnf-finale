import { Optional } from '@nestjs/common';

export class CreateHotelDto {
  @Optional()
  id: string = '';

  title: string;

  description: string;

  createdAt: Date = new Date();

  updatedAt: Date = this.createdAt;
}
