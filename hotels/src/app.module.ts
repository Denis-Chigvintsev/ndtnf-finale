/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoomsModule } from './modules/hotel-rooms/hotel-rooms.module';
import { IamModule } from './modules/iam/iam.module';
import { SupportModule } from './modules/support/support.module';
import { WsModule } from './modules/ws/ws.module';

@Module({
  imports: [
    UsersModule,
    HotelsModule,
    ReservationsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION as string),
    HotelRoomsModule,
    IamModule,
    SupportModule,
    WsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
