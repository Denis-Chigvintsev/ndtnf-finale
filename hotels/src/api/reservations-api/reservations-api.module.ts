import { Module } from '@nestjs/common';

import { ReservationsApiController } from './reservations-api.controller';
import { ReservationsModule } from '../../modules/reservations/reservations.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Reservation,
  ReservationSchema,
} from '../../modules/reservations/entities/reservation.entity';
import { ReservationsService } from '../../modules/reservations/reservations.service';
import { HotelsModule } from '../../modules/hotels/hotels.module';
import { HotelRoomsModule } from '../../modules/hotel-rooms/hotel-rooms.module';
import { HotelsService } from '../../modules/hotels/hotels.service';
import { HotelRoomsService } from '../../modules/hotel-rooms/hotel-rooms.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
    ReservationsModule,
    HotelsModule,
    HotelRoomsModule,
  ],

  controllers: [ReservationsApiController],
  providers: [ReservationsService, HotelsService, HotelRoomsService],
})
export class ReservationsApiModule {}
