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
import { FullCloseGuard } from '../iam/guards/full-close/full-close.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard, AdminGuard)
  @Post('createuser/admin')
  async create(@Body() createUserDto: CreateUserDto) {
    //  console.log('createUser');
    return await this.usersService.create(createUserDto);
  }
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard, ManagerGuard)
  @Get('findall/admin/manager')
  findAll() {
    //  console.log('findAll');
    return this.usersService.findAll();
  }
  @UseGuards(FullCloseGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    //  console.log('findOne');
    return this.usersService.findOne(id);
  }
  @UseGuards(FullCloseGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(SessionGuard, AdminGuard)
  @Patch('upgrade/admin/:id')
  upgradeUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @UseGuards(FullCloseGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
