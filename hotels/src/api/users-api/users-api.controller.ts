/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { AdminGuard } from '../../modules/iam/guards/admin/admin.guard';
import { ManagerGuard } from '../../modules/iam/guards/manager/manager.guard';
import { SessionGuard } from '../../modules/iam/guards/session/session.guard';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';
import { UsersService } from '../../modules/users/users.service';

@Controller('api')
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  //2.4.1. Создание пользователя
  @UseGuards(SessionGuard, AdminGuard)
  @Post('admin/users')
  create(@Body() createUserDto: CreateUserDto, @Res() res) {
    interface IExitDto {
      id: string;
      email: string;
      name: string;
      contactPhone: string;
      role: string;
    }

    const exitDto: IExitDto = {
      id: '',
      email: '',
      name: '',
      contactPhone: '',
      role: '',
    };

    this.usersService
      .create(createUserDto)
      .then((data) => {
        exitDto.id = data.id;
        exitDto.email = data.email;
        exitDto.name = data.name;
        if (data.contactPhone) exitDto.contactPhone = data.contactPhone;
        exitDto.role = data.role;
      })
      .then(() => {
        res.status(200).send(exitDto);
      });
  }

  @UseGuards(SessionGuard, ManagerGuard)
  @Get('admin/users')
  findAll(@Res() res) {
    //  console.log('findAll');

    interface IExitDto {
      id: string;
      email: string;
      name: string;
      contactPhone: string;
    }

    const exitArray: any[] = [];

    this.usersService.findAll().then((data) => {
      data.map((el) => {
        const exitDto: IExitDto = {
          id: '',
          email: '',
          name: '',
          contactPhone: '',
        };
        exitDto.id = el.id;
        exitDto.email = el.email;
        exitDto.name = el.name;
        if (el.contactPhone) exitDto.contactPhone = el.contactPhone;
        exitArray.push(exitDto);
        if (exitArray.length == data.length) res.status(200).send(exitArray);
      });
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //  console.log('findOne');
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @UseGuards(SessionGuard, AdminGuard)
  @Patch('upgrade/admin/:id')
  upgradeUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
