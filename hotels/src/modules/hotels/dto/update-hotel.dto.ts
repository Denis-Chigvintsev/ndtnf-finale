/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateHotelDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsDate()
  @IsOptional()
  updatedAt?: Date = new Date();
}
