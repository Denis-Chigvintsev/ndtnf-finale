import { Optional } from '@nestjs/common';

export class CreateHotelRoomDto {
  @Optional()
  id?: string = '';

  hotelId: string;

  description: string;

  images: string[] = [];

  createdAt: Date = new Date();

  updatedAt: Date = this.createdAt;

  isEnabled: boolean;
}
