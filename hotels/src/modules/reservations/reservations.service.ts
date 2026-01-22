/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { HttpException, Injectable } from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../hotels/entities/hotel.entity';
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoom } from '../hotel-rooms/entities/hotel-room.entity';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

const Calendar = require('calendar-base').Calendar;

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,

    @InjectModel(Hotel.name)
    private hotelModel: Model<Hotel>,

    @InjectModel(HotelRoom.name)
    private readonly hotelRoomModel: Model<HotelRoom>,
  ) {}

  create(createReservationDto, session, res) {
    createReservationDto.userId = session.user.id;

    //if (!hotel[0]) {
    //  return { message: 'Bad_hotelId' };
    // }

    let current;
    let found;
    let updatedMap;
    let updatedRoom;
    let endDate;
    let room0;

    current = new Date(createReservationDto.dateStart);
    endDate = new Date(createReservationDto.dateEnd);

    const day = current.getDate();
    const month = current.getMonth();
    const year = current.getFullYear();

    this.hotelRoomModel
      .findOne({ id: createReservationDto.roomId })
      .then((room) => {
        if (!room) {
          return res.status(400).send(
            {
              status: 400,
              error: 'номера с указанным ID не существует',
            },
            400,
          );
        }
        if (room.isEnabled == false) {
          return res.status(400).send(
            {
              status: 400,
              error: 'номер снят с бронирования',
            },
            400,
          );
        }
        if (room) {
          do {
            const day = current.getDate();
            const year = current.getFullYear();
            const month = current.getMonth();

            found = room?.map.find((el) => {
              if (
                el.day == day &&
                el.year == year &&
                el.month == month &&
                el.vacant == false
              ) {
                return true;
              }
            });
            updatedMap = room?.map.map((el) => {
              if (el.day == day && el.year == year && el.month == month) {
                el.vacant = false;
              }
              return el;
            });
            current.setDate(current.getDate() + 1);
          } while (current <= endDate && !found);

          if (room) room.map = [...updatedMap];
          room0 = room;
          return room;
        }
      })
      .then(() => {
        if (found) {
          res.send({ message: 'overlap', map: room0.map });
        } else {
          createReservationDto.id = uuidv4();
          createReservationDto.hotelId = room0?.hotelId;

          if (room0) {
            this.hotelRoomModel
              .findOneAndUpdate(
                { id: room0.id },
                { $set: room0 },
                { new: true },
              )
              .then(() => {
                const reservation1 = new this.reservationModel(
                  createReservationDto,
                );
                reservation1.save();
                //res.send({ message: 'успех' });
              })
              .then(() => {
                interface IExitDto {
                  id: string;
                  startDate: string;
                  endDate: string;
                  hotelRoom: { images: any[]; description: string };
                  hotel: { title: string; description: string };
                }
                const { dateStart, dateEnd, hotelId, id, roomId, userId } =
                  createReservationDto;
                const dateStart1 = new Date(dateStart);
                const dateEnd1 = new Date(dateEnd);
                const exitDto: IExitDto = {
                  id: id,
                  startDate: dateStart1.toLocaleDateString('ru-RU'),
                  endDate: dateEnd1.toLocaleDateString('ru-RU'),
                  hotelRoom: { images: [], description: '' },
                  hotel: { title: '', description: '' },
                };

                this.hotelModel.findOne({ id: hotelId }).then((hotel) => {
                  if (hotel?.title) exitDto.hotel.title = hotel.title;
                  if (hotel?.description)
                    exitDto.hotel.description = hotel.description;
                });
                this.hotelRoomModel
                  .findOne({ id: roomId })
                  .then((room) => {
                    if (room?.images)
                      exitDto.hotelRoom.images = [...room.images];
                    if (room?.description)
                      exitDto.hotelRoom.description = room.description;
                  })
                  .then(() => {
                    res.send(exitDto);
                  });
              });
          }
        }
      });
  }
  async getUserReservations(session) {
    const userId = await session.user.id;
    return await this.reservationModel.find({ userId: userId });
  }

  remove(id: string, res, session) {
    let roomId, dateStart, dateEnd, current, dateStart1, dateEnd1, updatedMap;
    this.reservationModel.findOne({ id: id }).then((data) => {
      roomId = data?.roomId;
      dateStart1 = data?.dateStart;
      dateEnd1 = data?.dateEnd;

      dateStart = new Date(dateStart1);
      dateEnd = new Date(dateEnd1);
      current = dateStart;

      if (data?.userId == session.user.id) {
        this.reservationModel
          .deleteOne({
            id: id,
          })
          .then((deleted) => {
            //    console.log(deleted.deletedCount);

            if (deleted.deletedCount === 1) {
              this.hotelRoomModel.findOne({ id: roomId }).then((room) => {
                do {
                  const day = current.getDate();
                  const year = current.getFullYear();
                  const month = current.getMonth();

                  updatedMap = room?.map.map((el) => {
                    if (el.day == day && el.year == year && el.month == month) {
                      el.vacant = true;
                    }
                    return el;
                  });

                  current.setDate(current.getDate() + 1);
                } while (current <= dateEnd);
                if (room) {
                  room.map = [...updatedMap];
                  //  console.log(1900, room.map);
                  setTimeout(() => {
                    //   console.log(2000, updatedMap);
                  }, 3000);

                  this.hotelRoomModel
                    .findOneAndUpdate(
                      { id: room.id },
                      { $set: room },
                      { new: true },
                    )
                    .then(() => res.status(200).send({}));
                }
              });
            }
            if (deleted.deletedCount === 0) {
              res.status(400).send(
                {
                  status: 400,
                  error: `бронирования с ID ${id} отсутсвует`,
                },
                400,
              );
            }
          });
      } else {
        res.status(403).send(
          {
            status: 403,
            error: `неверное задание номера брони`,
          },
          400,
        );
      }
    });
  }

  remove1(id: string, res) {
    let roomId, dateStart, dateEnd, current, dateStart1, dateEnd1, updatedMap;
    this.reservationModel.findOne({ id: id }).then((data) => {
      roomId = data?.roomId;
      dateStart1 = data?.dateStart;
      dateEnd1 = data?.dateEnd;

      dateStart = new Date(dateStart1);
      dateEnd = new Date(dateEnd1);
      current = dateStart;

      if (1 == 1) {
        this.reservationModel
          .deleteOne({
            id: id,
          })
          .then((deleted) => {
            //    console.log(deleted.deletedCount);

            if (deleted.deletedCount === 1) {
              this.hotelRoomModel.findOne({ id: roomId }).then((room) => {
                do {
                  const day = current.getDate();
                  const year = current.getFullYear();
                  const month = current.getMonth();

                  updatedMap = room?.map.map((el) => {
                    if (el.day == day && el.year == year && el.month == month) {
                      el.vacant = true;
                    }
                    return el;
                  });

                  current.setDate(current.getDate() + 1);
                } while (current <= dateEnd);
                if (room) {
                  room.map = [...updatedMap];
                  //  console.log(1900, room.map);
                  setTimeout(() => {
                    //   console.log(2000, updatedMap);
                  }, 3000);

                  this.hotelRoomModel
                    .findOneAndUpdate(
                      { id: room.id },
                      { $set: room },
                      { new: true },
                    )
                    .then(() => res.status(200).send({}));
                }
              });
            }
            if (deleted.deletedCount === 0) {
              res.status(400).send(
                {
                  status: 400,
                  error: `бронирования с ID ${id} отсутсвует`,
                },
                400,
              );
            }
          });
      } else {
        res.status(403).send(
          {
            status: 403,
            error: `неверное задание номера брони`,
          },
          400,
        );
      }
    });
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
