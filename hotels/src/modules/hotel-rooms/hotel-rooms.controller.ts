import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { HotelRoomsService } from './hotel-rooms.service';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { UpdateHotelRoomDto } from './dto/update-hotel-room.dto';
import { SessionGuard } from '../iam/guards/session/session.guard';
import { AdminGuard } from '../iam/guards/admin/admin.guard';
import { FullCloseGuard } from '../iam/guards/full-close/full-close.guard';

@Controller('hotel-rooms')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @UseGuards(SessionGuard, AdminGuard, FullCloseGuard)
  @Post('admin')
  async create(@Body() createHotelRoomDto: CreateHotelRoomDto) {
    //  console.log('create room');
    return await this.hotelRoomsService.create(createHotelRoomDto);
  }
  //доступен для всех
  @UseGuards(FullCloseGuard)
  @Get()
  async findAll() {
    return await this.hotelRoomsService.findAll();
  }
  //доступен для всех
  @UseGuards(FullCloseGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hotelRoomsService.findOne(id);
  }
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard, AdminGuard)
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body() updateHotelRoomDto: UpdateHotelRoomDto,
    @Res() res,
  ) {
    return this.hotelRoomsService.update(id, updateHotelRoomDto, res);
  }
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelRoomsService.remove(+id);
  }
}
