import { Module } from '@nestjs/common';
import { HotelsApiController } from './hotels-api.controller';
import { HotelsModule } from '../../modules/hotels/hotels.module';
import { HotelsService } from '../../modules/hotels/hotels.service';
import { HotelRoomsService } from '../../modules/hotel-rooms/hotel-rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from '../../modules/hotels/entities/hotel.entity';
import {
  HotelRoom,
  HotelRoomSchema,
} from '../../modules/hotel-rooms/entities/hotel-room.entity';

@Module({
  imports: [
    HotelsModule,
    MongooseModule.forFeature([
      {
        name: Hotel.name,
        schema: HotelSchema,
      },
      {
        name: HotelRoom.name,
        schema: HotelRoomSchema,
      },
    ]),
  ],
  controllers: [HotelsApiController],
  providers: [HotelsService, HotelRoomsService],
})
export class HotelsApiModule {}
