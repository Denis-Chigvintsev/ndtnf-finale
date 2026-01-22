/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Res,
} from '@nestjs/common';

import { HotelsService } from '../../modules/hotels/hotels.service';
import { AdminGuard } from '../../modules/iam/guards/admin/admin.guard';
import { SessionGuard } from '../../modules/iam/guards/session/session.guard';
import { CreateHotelDto } from '../../modules/hotels/dto/create-hotel.dto';
import { UpdateHotelDto } from '../../modules/hotels/dto/update-hotel.dto';
import { HotelRoomsService } from '../../modules/hotel-rooms/hotel-rooms.service';
import { CreateHotelRoomDto } from '../../modules/hotel-rooms/dto/create-hotel-room.dto';
import { UpdateHotelRoomDto } from '../../modules/hotel-rooms/dto/update-hotel-room.dto';
import { FullCloseGuard } from '../../modules/iam/guards/full-close/full-close.guard';

@Controller('api')
export class HotelsApiController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelRoomsService: HotelRoomsService,
  ) {}

  //2.1.3. Добавление гостиницы
  @UseGuards(SessionGuard, AdminGuard)
  @Post('admin/hotels')
  async create(@Body() createHotelDto: CreateHotelDto) {
    const created: any = await this.hotelsService.create(createHotelDto);

    const returnDto = {
      id: await created.id,
      title: await created.title,
      description: await created.description,
    };

    return returnDto;
  }

  //2.1.4. Получение списка гостиниц
  @UseGuards(SessionGuard, AdminGuard)
  @Get('admin/hotels')
  async findAll() {
    const found: any = await this.hotelsService.findAll();

    const found1 = await found.map((el: any) => {
      const id = el.id;
      const title = el.title;
      const description = el.description;
      el = {};
      el = { id, description, title };
      return el;
    });
    return await found1;
  }

  // этот эндпоинт не используется\
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hotelsService.findOne(id);
  }

  // 2.1.5. Изменение описания гостиницы
  @UseGuards(SessionGuard, AdminGuard)
  @Put('admin/hotels/:id')
  async update(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @Res() res,
  ) {
    const updated: any = await this.hotelsService.update(
      id,
      updateHotelDto,
      res,
    );
    if (await updated) {
      const returnDto = {
        id: await updated?.id,
        title: await updated?.title,
        description: await updated?.description,
      };

      res.status(200).send(returnDto);
    }
  }

  //этот эндпоинт не используется
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(+id);
  }

  ///ниже идут эндпоинты из hotel-rooms- буква R -это от rooms

  //2.1.6. Добавление номера
  @UseGuards(SessionGuard, AdminGuard)
  @Post('admin/hotel-rooms')
  async createR(@Body() createHotelRoomDto: CreateHotelRoomDto, @Res() res) {
    const foundhotel: any = await this.hotelsService.findOne(
      createHotelRoomDto.hotelId,
    );

    if ((await foundhotel.length) == 0) {
      res.status(400).send(
        {
          status: 400,
          error: `id гостиницы указано неверно`,
        },
        400,
      );

      return;
    }

    const created: any =
      await this.hotelRoomsService.create(createHotelRoomDto);

    const foundhotelExit = {
      id: await foundhotel[0].id,
      title: await foundhotel[0].title,
      description: await foundhotel[0].description,
    };

    const returnDto = {
      id: await created.id,
      description: await created.description,
      images: await created.images,
      isEnabled: await created.isEnabled,
      hotel: foundhotelExit,
    };

    res.status(200).send(returnDto);
  }

  //2.1.1. Поиск номеров
  @Get('common/hotel-rooms')
  async findAllR(@Res() res: any) {
    const found: any = await this.hotelRoomsService.findAll();

    if ((await found.length) == 0) {
      res.status(200).send([]);
      return;
    }
    let exitAr: any[] = [];
    found.map((el: any) => {
      const id = el.id;
      const description = el.description;
      const images = el.images;
      const hotel = {
        id: el.hotelId,
        title: '',
        description: '',
      };
      el = {};
      this.hotelsService.findOne(hotel.id).then((data) => {
        hotel.description = data[0]?.description;
        hotel.title = data[0]?.title;
        const a = { id, description, images, hotel };
        exitAr.push(a);
        if (exitAr.length == found.length) {
          res.send(exitAr);
        }
      });
    });
  }

  //2.1.2. Информация о конкретном номере
  @Get('common/hotel-rooms/:id')
  async findOneR(@Param('id') id: string, @Res() res: any) {
    const found: any = await this.hotelRoomsService.findOne(id);

    if ((await found.length) == 0) {
      res.status(400).send(
        {
          status: 400,
          error: `id номера указано неверно`,
        },
        400,
      );

      return;
    }

    const found1 = await found[0];

    const exit = {
      id: await found1.id,
      description: await found1.description,
      images: await found1.images,
      hotel: {
        id: await found1.hotelId,
        title: '',
        description: '',
      },
    };
    this.hotelsService.findOne(await exit.hotel.id).then((data) => {
      exit.hotel.description = data[0].description;
      exit.hotel.title = data[0].title;
      res.send(exit);
    });
  }

  //2.1.7. Изменение описания номера
  @UseGuards(SessionGuard, AdminGuard)
  @Put('admin/hotel-rooms/:id')
  async updateR(
    @Param('id') id: string,
    @Body() updateHotelRoomDto: UpdateHotelRoomDto,
    @Res() res: any,
  ) {
    const found: any = await this.hotelRoomsService.update(
      id,
      updateHotelRoomDto,
      res,
    );

    if (await found) {
      const exit = {
        id: await found?.id,
        description: await found?.description,
        images: await found?.images,
        isEnabled: await found?.isEnabled,
        hotel: {
          id: await found?.hotelId,
          title: '',
          description: '',
        },
      };
      this.hotelsService.findOne(await exit.hotel.id).then((data) => {
        if (data) {
          exit.hotel.description = data[0]?.description;
          exit.hotel.title = data[0]?.title;
          res.send(exit);
        } else
          res.status(400).send(
            {
              status: 400,
              error: `наименование гостиницы указано неверно`,
            },
            400,
          );
      });
    }
  }

  //этот эндпоинт пока не используется
  @UseGuards(SessionGuard)
  @Delete(':id')
  removeR(@Param('id') id: string) {
    return this.hotelRoomsService.remove(+id);
  }
}
