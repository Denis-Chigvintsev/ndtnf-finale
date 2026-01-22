import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateHotelRoomDto {
  //  @IsString()
  // @Optional()
  //  id?: string = '';

  @IsString()
  // @IsOptional()
  hotelId?: string;

  @IsString()
  // @IsOptional()
  description?: string;

  @IsString({ each: true })
  // @IsOptional()
  images?: string[];

  // @IsDate()
  //  @Optional()
  // createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsBoolean()
  // @IsOptional()
  isEnabled?: boolean;
}
