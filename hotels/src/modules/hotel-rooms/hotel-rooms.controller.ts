import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HotelRoomsService } from './hotel-rooms.service';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { UpdateHotelRoomDto } from './dto/update-hotel-room.dto';
import { SessionGuard } from '../iam/guards/session/session.guard';
import { AdminGuard } from '../iam/guards/admin/admin.guard';

@Controller('hotel-rooms')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @UseGuards(SessionGuard, AdminGuard)
  @Post('admin')
  async create(@Body() createHotelRoomDto: CreateHotelRoomDto) {
    console.log('create room');
    return await this.hotelRoomsService.create(createHotelRoomDto);
  }
  //доступен для всех
  @Get()
  async findAll() {
    return await this.hotelRoomsService.findAll();
  }
  //доступен для всех
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hotelRoomsService.findOne(id);
  }
  @UseGuards(SessionGuard, AdminGuard)
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body() updateHotelRoomDto: UpdateHotelRoomDto,
  ) {
    return this.hotelRoomsService.update(id, updateHotelRoomDto);
  }

  @UseGuards(SessionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelRoomsService.remove(+id);
  }
}
