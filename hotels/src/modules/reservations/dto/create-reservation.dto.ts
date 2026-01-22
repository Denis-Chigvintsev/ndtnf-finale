import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsOptional()
  id: string = '';

  @IsOptional()
  userId: string;

  @IsString()
  roomId: string; //////////////////////

  @IsOptional()
  hotelId?: string;

  //@IsString()
  @IsDateString()
  dateStart: string; /////////////////////

  @IsString()
  @IsDateString()
  dateEnd: string; ////////////////////
}
