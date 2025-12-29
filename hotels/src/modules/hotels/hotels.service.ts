/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto) {
    const foundTitle = await this.hotelModel.find({
      title: createHotelDto.title,
    });
    console.log('foundTitle', foundTitle);
    if (foundTitle[0]) {
      return {
        message: ` Гостиница "${createHotelDto.title}" уже занесена в базу`,
      };
    }

    createHotelDto.id = uuidv4();
    createHotelDto.createdAt = new Date();
    createHotelDto.updatedAt = new Date();
    const hotel1 = new this.hotelModel(createHotelDto);

    return await hotel1.save();
  }

  async findAll() {
    return await this.hotelModel.find();
  }

  async findOne(id: string) {
    console.log(3424, id);
    console.log(await this.hotelModel.find({ id: id }));
    return await this.hotelModel.find({ id: id });
  }

  async update(id: string, updateHotelDto: UpdateHotelDto) {
    console.log(`hotel update ${id}`);
    const found = await this.hotelModel.find({ id: id });
    console.log(found);

    if (!found[0]) {
      console.log('введенный id неверен');
      return { message: `Введенный id гостиницы ${id} неверен` };
    }

    updateHotelDto.updatedAt = new Date();
    return await this.hotelModel.findOneAndUpdate(
      { id: id },
      { $set: updateHotelDto },
      { new: true },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
