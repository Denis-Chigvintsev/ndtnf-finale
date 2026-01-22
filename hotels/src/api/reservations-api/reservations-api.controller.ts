/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Session,
  Res,
} from '@nestjs/common';

import { ReservationsService } from '../../modules/reservations/reservations.service';
import { SessionGuard } from '../../modules/iam/guards/session/session.guard';
import { CreateReservationDto } from '../../modules/reservations/dto/create-reservation.dto';
import { ManagerGuard } from '../../modules/iam/guards/manager/manager.guard';
import { UpdateReservationDto } from '../../modules/reservations/dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from '../../modules/reservations/entities/reservation.entity';
import { Hotel } from '../../modules/hotels/entities/hotel.entity';
import { HotelRoom } from '../../modules/hotel-rooms/entities/hotel-room.entity';
import { Model } from 'mongoose';

@Controller('api')
export class ReservationsApiController {
  constructor(
    private readonly reservationsService: ReservationsService,

    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,

    @InjectModel(Hotel.name)
    private hotelModel: Model<Hotel>,

    @InjectModel(HotelRoom.name)
    private readonly hotelRoomModel: Model<HotelRoom>,
  ) {}

  //2.2.1. Бронирование номера клиентом
  @UseGuards(SessionGuard)
  @Post('client/reservations')
  create(
    @Body() createReservationDto: CreateReservationDto,
    @Session() session: Record<string, any>,
    @Res() res: any,
  ) {
    this.reservationsService.create(createReservationDto, session, res);
  }

  //2.2.2. Список броней текущего пользователя
  @UseGuards(SessionGuard)
  @Get('client/reservations')
  async getUserReservations(
    @Session() session: Record<string, any>,
    @Res() res,
  ) {
    interface IExitDto {
      id: string;
      userId: string;
      startDate: string;
      endDate: string;
      hotelRoom: { images: any[]; description: string };
      hotel: { title: string; description: string };
    }

    const exitArray: any[] = [];

    this.reservationsService.getUserReservations(session).then((data) => {
      if (data.length == 0) {
        res.status(200).send([]);
        return;
      }
      data.map((el) => {
        let exitReservation: IExitDto = {
          id: '',
          userId: '',
          hotelRoom: { images: [], description: '' },
          hotel: { title: '', description: '' },
          startDate: '',
          endDate: '',
        };

        const dateStart1 = new Date(el.dateStart);
        const dateEnd1 = new Date(el.dateEnd);

        exitReservation.startDate = dateStart1.toLocaleDateString('ru-RU');
        exitReservation.endDate = dateEnd1.toLocaleDateString('ru-RU');
        exitReservation.id = el.id;
        exitReservation.userId = el.userId;

        this.hotelRoomModel
          .findOne({ id: el.roomId })
          .then((room) => {
            if (room?.images)
              exitReservation.hotelRoom.images = [...room?.images];
            if (room?.description)
              exitReservation.hotelRoom.description = room?.description;
          })
          .then(() => {
            this.hotelModel
              .findOne({ id: el.hotelId })
              .then((hotel) => {
                if (hotel?.title) exitReservation.hotel.title = hotel.title;
                if (hotel?.description)
                  exitReservation.hotel.description = hotel.description;
              })
              .then(() => {
                exitArray.push(exitReservation);
                if (exitArray.length == data.length) res.send(exitArray);
              });
          });
      });
      /////
    });
  }

  @UseGuards(SessionGuard)
  @Get()
  async findAll() {
    return await this.reservationsService.findAll();
  }

  //2.2.4. Список броней конкретного пользователя
  @UseGuards(SessionGuard, ManagerGuard)
  @Get('manager/reservations/:userid')
  async findReservationofUser(@Param('userid') userid: string, @Res() res) {
    interface IExitDto {
      id: string;
      startDate: string;
      endDate: string;
      hotelRoom: { images: any[]; description: string };
      hotel: { title: string; description: string };
    }

    const exitArray: any[] = [];

    this.reservationsService
      .findbyUserID(userid)

      .then((data) => {
        console.log(data);
        if (data.length == 0) {
          res.status(200).send([]);
          return;
        } else {
          data.map((el) => {
            const exitReservation: IExitDto = {
              id: '',
              hotelRoom: { images: [], description: '' },
              hotel: { title: '', description: '' },
              startDate: '',
              endDate: '',
            };

            const dateStart1 = new Date(el.dateStart);
            const dateEnd1 = new Date(el.dateEnd);

            exitReservation.startDate = dateStart1.toLocaleDateString('ru-RU');
            exitReservation.endDate = dateEnd1.toLocaleDateString('ru-RU');
            exitReservation.id = el.id;

            this.hotelRoomModel
              .findOne({ id: el.roomId })
              .then((room) => {
                if (room?.images)
                  exitReservation.hotelRoom.images = [...room?.images];
                if (room?.description)
                  exitReservation.hotelRoom.description = room?.description;
              })
              .then(() => {
                this.hotelModel
                  .findOne({ id: el.hotelId })
                  .then((hotel) => {
                    if (hotel?.title) exitReservation.hotel.title = hotel.title;
                    if (hotel?.description)
                      exitReservation.hotel.description = hotel.description;
                  })
                  .then(() => {
                    exitArray.push(exitReservation);
                    if (exitArray.length == data.length) res.send(exitArray);
                  });
              });
          });
        }
        /////
      });
  }

  @UseGuards(SessionGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  //  2.2.3. Отмена бронирования клиентом
  @UseGuards(SessionGuard)
  @Delete('client/reservations/:id')
  remove(@Param('id') id: string, @Res() res, @Session() session) {
    this.reservationsService.remove(id, res, session);
  }
  //2.2.5. Отмена бронирования менеджером
  @UseGuards(SessionGuard)
  @Delete('manager/:userid/:reservationid')
  remove1(@Param('reservationid') id, @Res() res) {
    return this.reservationsService.remove1(id, res);
  }
}
