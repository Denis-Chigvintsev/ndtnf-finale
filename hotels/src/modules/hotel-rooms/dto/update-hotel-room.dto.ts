import { Optional } from '@nestjs/common';

export class UpdateHotelRoomDto {
  @Optional()
  id?: string = '';

  @Optional()
  hotelId?: string;

  @Optional()
  description?: string;

  @Optional()
  images?: string[];

  @Optional()
  createdAt?: Date;

  @Optional()
  updatedAt?: Date;

  @Optional()
  isEnabled?: boolean;
}
