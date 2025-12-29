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
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { SessionGuard } from '../iam/guards/session/session.guard';
import { AdminGuard } from '../iam/guards/admin/admin.guard';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @UseGuards(SessionGuard, AdminGuard)
  @Post('admin')
  async create(@Body() createHotelDto: CreateHotelDto) {
    console.log('hotels create');
    return await this.hotelsService.create(createHotelDto);
  }

  @UseGuards(SessionGuard, AdminGuard)
  @Get('admin')
  async findAll() {
    console.log('hotels findAll');
    return await this.hotelsService.findAll();
  }
  @UseGuards(SessionGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('hotels findOne');
    return await this.hotelsService.findOne(id);
  }
  @UseGuards(SessionGuard, AdminGuard)
  @Patch('admin/:id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(id, updateHotelDto);
  }
  @UseGuards(SessionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(+id);
  }
}
