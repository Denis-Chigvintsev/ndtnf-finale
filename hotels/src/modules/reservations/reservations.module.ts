import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './entities/reservation.entity';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoomsModule } from '../hotel-rooms/hotel-rooms.module';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),

    HotelsModule,
    HotelRoomsModule,
  ],

  controllers: [ReservationsController],
  providers: [ReservationsService, HotelsService, HotelRoomsService],
})
export class ReservationsModule {}
