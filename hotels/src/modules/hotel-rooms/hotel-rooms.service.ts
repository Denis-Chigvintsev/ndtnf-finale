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
      return { message: 'Bad_hotelId' };
    }

    createHotelRoomDto.id = uuidv4();

    createHotelRoomDto.createdAt = new Date();
    createHotelRoomDto.updatedAt = new Date();

    console.log(-10000000000, createHotelRoomDto);
    const room1 = new this.hotelRoomModel(createHotelRoomDto);

    return await room1.save();
  }

  async findAll() {
    return await this.hotelRoomModel.find();
  }

  async findOne(id: string) {
    return await this.hotelRoomModel.find({ id: id });
  }

  async update(id: string, updateHotelRoomDto: UpdateHotelRoomDto) {
    const oldimages = await this.hotelRoomModel.find({ id: id });

    try {
      await fs.promises.unlink(`./uploads/${oldimages[0].images[0]}`);
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
