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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionGuard } from '../iam/guards/session/session.guard';
import { AdminGuard } from '../iam/guards/admin/admin.guard';
import { ManagerGuard } from '../iam/guards/manager/manager.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionGuard, AdminGuard)
  @Post('createuser/admin')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('createUser');
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(SessionGuard, ManagerGuard)
  @Get('findall/admin/manager')
  findAll() {
    console.log('findAll');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('findOne');
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
