/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { HashingService } from '../hashing/hashing.service';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import { v4 as uuidv4 } from 'uuid';

import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const foundInDatabase: any = await this.usersService.findOneByEmail(
      signUpDto.email,
    );

    if (foundInDatabase[0]) {
      return {
        message:
          'пользователь с таким email существует -- попробуйте другой email',
      };
    } else {
      if (!signUpDto.role) {
        signUpDto.role = 'client';
      }
      if (
        signUpDto.email == process.env.SECRET_ADMIN &&
        signUpDto.password == process.env.SECRET_ADMIN_PASS
      ) {
        signUpDto.role = 'admin';
      }

      return await this.usersService.create({
        email: signUpDto.email,
        password: await this.hashingService.hash(signUpDto.password),
        name: signUpDto.name,
        contactPhone: signUpDto.contactPhone,
        role: signUpDto.role,
      });
    }
  }

  async signIn(signInDto: SignInDto, req: Request, session) {
    const foundInDatabase: any = await this.usersService.findOneByEmail(
      signInDto.email,
    );
    if (!foundInDatabase[0]?.email) {
      return {
        message: 'такого пользователя не существует',
      };
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      foundInDatabase[0].password,
    );

    if (!isEqual) {
      return { message: 'пароль неверен' };
    } else {
      session.isAuthenticated = true;
      session.user = {
        email: foundInDatabase[0].email,
        name: foundInDatabase[0].name,
        id: foundInDatabase[0].id,
        role: foundInDatabase[0].role,
      };
      console.log(103, session, await session.id);
      const sessionDto = { sessionId: await session.id };
      const update = await this.userModel.findOneAndUpdate(
        { email: foundInDatabase[0].email },
        { $set: sessionDto },
        { new: true },
      );
      return {
        message: 'успех',
        name: await session.user.name,
        role: await session.user.role,
        update: update,
      };
    }
  }
}
