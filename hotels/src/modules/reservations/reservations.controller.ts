/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Session,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { SessionGuard } from '../iam/guards/session/session.guard';
import { ManagerGuard } from '../iam/guards/manager/manager.guard';
import { AdminGuard } from '../iam/guards/admin/admin.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}
  @UseGuards(SessionGuard)
  @Post('client')
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Session() session: Record<string, any>,
  ) {
    return await this.reservationsService.create(createReservationDto, session);
  }

  @UseGuards(SessionGuard)
  @Get('reservations/client')
  async getUserReservations(@Session() session: Record<string, any>) {
    console.log('getUserReservations');
    return await this.reservationsService.getUserReservations(session);
  }

  @UseGuards(SessionGuard)
  @Get()
  async findAll() {
    return await this.reservationsService.findAll();
  }

  @UseGuards(SessionGuard, ManagerGuard)
  @Get('manager/:userid')
  async findOne(@Param('userid') userid: string) {
    console.log(900900, userid);
    return await this.reservationsService.findbyUserID(userid);
  }

  @UseGuards(SessionGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @UseGuards(SessionGuard)
  @Delete('client/:id')
  async remove(@Param('id') id: string) {
    return await this.reservationsService.remove(id);
  }

  @UseGuards(SessionGuard)
  @Delete('manager/:userid/:reservationid')
  async remove1(@Param('userid') userid: string, @Param('reservationid') id) {
    return await this.reservationsService.remove1(userid, id);
  }
}
