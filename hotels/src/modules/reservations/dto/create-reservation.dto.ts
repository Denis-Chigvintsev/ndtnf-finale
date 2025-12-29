import { Optional } from '@nestjs/common';

export class CreateReservationDto {
  @Optional()
  id: string = '';

  userId: string;

  roomId: string;

  dateStart: Date;

  dateEnd: Date;
}
