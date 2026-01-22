import { IsOptional, IsString } from 'class-validator';
import { IsDate } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsOptional()
  id: string = '';

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  createdAt: Date = new Date();

  @IsOptional()
  @IsDate()
  updatedAt: Date = this.createdAt;
}
