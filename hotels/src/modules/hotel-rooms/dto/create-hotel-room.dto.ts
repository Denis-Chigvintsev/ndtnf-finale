import { Day } from '../types/day.type';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsDate } from 'class-validator';
import { IsBoolean } from 'class-validator';

export class CreateHotelRoomDto {
  @IsString()
  @IsOptional()
  id?: string = '';

  @IsString()
  hotelId: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  images: string[] = [];

  @IsDate()
  @IsOptional()
  createdAt: Date = new Date();

  @IsOptional()
  @IsDate()
  updatedAt: Date = this.createdAt;

  @IsOptional()
  @IsBoolean()
  isEnabled: boolean;

  @IsOptional()
  @ValidateNested()
  map?: Day[];
}
