/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../hotels/entities/hotel.entity';
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoom } from '../hotel-rooms/entities/hotel-room.entity';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,

    @InjectModel(Hotel.name)
    private hotelModel: Model<Hotel>,
    private hotelsService: HotelsService,

    @InjectModel(HotelRoom.name)
    private readonly hotelRoomModel: Model<HotelRoom>,
    private readonly hotelRoomsService: HotelRoomsService,
  ) {}

  async create(createReservationDto: CreateReservationDto, session) {
    console.log(5454, session.user);

    createReservationDto.userId = session.user.id;

    //if (!hotel[0]) {
    //  return { message: 'Bad_hotelId' };
    // }

    const room = await this.hotelRoomsService.findOne(
      createReservationDto.roomId,
    );

    if (!room[0]) {
      return { message: 'Bad_roomId' };
    }

    createReservationDto.id = uuidv4();

    const filter1 = {
      roomId: createReservationDto.roomId,

      $and: [
        { dateStart: { $lte: createReservationDto.dateStart } },
        { dateEnd: { $gt: createReservationDto.dateStart } },
      ],
    };

    const filter2 = {
      roomId: createReservationDto.roomId,

      $and: [
        { dateStart: { $gte: createReservationDto.dateStart } },
        { dateEnd: { $lte: createReservationDto.dateEnd } },
      ],
    };
    const filter3 = {
      roomId: createReservationDto.roomId,

      $and: [
        { dateStart: { $lt: createReservationDto.dateEnd } },
        { dateEnd: { $gte: createReservationDto.dateEnd } },
      ],
    };

    const filter4 = {
      roomId: createReservationDto.roomId,

      $and: [
        { dateStart: { $lte: createReservationDto.dateStart } },
        { dateEnd: { $gte: createReservationDto.dateEnd } },
      ],
    };

    console.log(171717, filter1);
    const overlap1 = await this.reservationModel.find(filter1);
    const overlap2 = await this.reservationModel.find(filter2);
    const overlap3 = await this.reservationModel.find(filter3);
    const overlap4 = await this.reservationModel.find(filter4);

    console.log(191919191919, overlap1, overlap2, overlap3, overlap4);
    if (!overlap1[0] && !overlap1[0] && !overlap3[0] && !overlap4[0]) {
      const reservation1 = new this.reservationModel(createReservationDto);

      return await reservation1.save();
    } else {
      overlap1.map((el) => {
        el.userId = '';
        el.roomId = '';
      });
      overlap2.map((el) => {
        el.userId = '';
        el.roomId = '';
      });
      overlap3.map((el) => {
        el.userId = '';
        el.roomId = '';
      });
      overlap4.map((el) => {
        el.userId = '';
        el.roomId = '';
      });

      return {
        message:
          'на эти даты зарезервировать нельзя из-за наложения других броней',
        overlap1: overlap1,
        overlap2: overlap2,
        overlap3: overlap3,
        overlap4: overlap4,
      };
    }
  }

  async getUserReservations(session) {
    const userId = await session.user.id;
    return await this.reservationModel.find({ userId: userId });
  }

  async remove(id: string) {
    console.log('remove');
    const deletedReservation = await this.reservationModel.deleteOne({
      id: id,
    });
    console.log(678901, deletedReservation.deletedCount);
    if (deletedReservation.deletedCount === 1) {
      return { message: `успех` };
    }
    if (deletedReservation.deletedCount === 0) {
      return {
        message: `бронирование ${id} не удалено или бронирование ${id} отсутсвует`,
      };
    }
  }

  async remove1(userId: string, id: string) {
    console.log('remove1');
    const deletedReservation = await this.reservationModel.deleteOne({
      id: id,
      userId: userId,
    });
    console.log('remove1', deletedReservation.deletedCount);
    if (deletedReservation.deletedCount === 1) {
      return { message: `успех` };
    }
    if (deletedReservation.deletedCount === 0) {
      return {
        message: `бронирование  ${id} пользователья ${userId}  не удалено или отсутсвует`,
      };
    }
  }

  async findAll() {
    return await this.reservationModel.find();
  }

  async findOne(id: string) {
    return await this.reservationModel.find({ id: id });
  }

  async findbyUserID(userid: string) {
    return await this.reservationModel.find({ userId: userid });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }
}
