/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { UpdateHotelRoomDto } from './dto/update-hotel-room.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelRoom } from './entities/hotel-room.entity';

import * as fs from 'fs';
import { HotelsService } from '../hotels/hotels.service';

const Calendar = require('calendar-base').Calendar;
const cal = new Calendar();

@Injectable()
export class HotelRoomsService {
  constructor(
    @InjectModel(HotelRoom.name)
    private readonly hotelRoomModel: Model<HotelRoom>,
    private readonly hotelService: HotelsService,
  ) {}

  async create(createHotelRoomDto: CreateHotelRoomDto) {
    const found = await this.hotelService.findOne(createHotelRoomDto.hotelId);
    if (!found) {
      return { message: 'Bad_hotelId', status: '400' };
    }

    createHotelRoomDto.id = uuidv4();

    createHotelRoomDto.createdAt = new Date();
    createHotelRoomDto.updatedAt = new Date();

    const currentYear = new Date().getFullYear();

    interface IMonth {
      day: number;
      weekday: number;
      month: number;
      year: number;
      vacant: boolean;
    }

    const map: any[] = [];

    let month: IMonth;
    for (let i = 0; i < 11; i++) {
      const month_ = cal.getCalendar(currentYear, i);
      month = month_.map((el) => {
        if (el !== false) el.vacant = true;
        if (el !== false) map.push(el);
        return el;
      });
    }

    createHotelRoomDto.map = [...map];

    const room1 = new this.hotelRoomModel(createHotelRoomDto);

    return await room1.save();
  }

  async findAll() {
    return await this.hotelRoomModel.find();
  }

  async findOne(id: string) {
    return await this.hotelRoomModel.find({ id: id });
  }

  async update(id: string, updateHotelRoomDto: UpdateHotelRoomDto, res: any) {
    let foundhotel;
    if (updateHotelRoomDto.hotelId) {
      foundhotel = await this.hotelService.findOne(updateHotelRoomDto.hotelId);
    }

    const found = await this.hotelRoomModel.find({ id: id });

    if (found.length == 0) {
      res.status(400).send(
        {
          status: 400,
          error: `id номера указано неверно`,
        },
        400,
      );

      return;
    }

    if (foundhotel.length == 0) {
      res.status(400).send(
        {
          status: 400,
          error: `id гостиницы указано неверно`,
        },
        400,
      );

      return;
    }

    try {
      await fs.promises.unlink(`./uploads/${found[0].images[0]}`);
    } catch (error) {
      console.log(error);
    }

    updateHotelRoomDto.updatedAt = new Date();
    return await this.hotelRoomModel.findOneAndUpdate(
      { id: id },
      { $set: updateHotelRoomDto },
      { new: true },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} hotelRoom`;
  }
}
