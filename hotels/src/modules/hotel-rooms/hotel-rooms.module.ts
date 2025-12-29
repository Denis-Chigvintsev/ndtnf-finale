import { Module } from '@nestjs/common';
import { HotelRoomsService } from './hotel-rooms.service';
import { HotelRoomsController } from './hotel-rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from './entities/hotel-room.entity';
import { FileModule } from '../../files/file.module';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelsService } from '../hotels/hotels.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HotelRoom.name,
        schema: HotelRoomSchema,
      },
    ]),
    FileModule,
    HotelsModule,
  ],
  controllers: [HotelRoomsController],
  providers: [HotelRoomsService, HotelsService],
  exports: [MongooseModule, HotelRoomsService],
})
export class HotelRoomsModule {}
