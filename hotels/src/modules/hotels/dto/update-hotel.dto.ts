/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Optional } from '@nestjs/common';

export class UpdateHotelDto {
  @Optional()
  title?: string;
  @Optional()
  description?: string;
  @Optional()
  updatedAt?: Date;
}
