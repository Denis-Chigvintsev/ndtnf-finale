/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { HashingService } from '../hashing/hashing.service';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import { v4 as uuidv4 } from 'uuid';

import { SignInDto } from './dto/sign-in.dto';
import { exhaustMap, from, take } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto, res: any) {
    const foundInDatabase: any = await this.usersService.findOneByEmail(
      signUpDto.email,
    );

    if (foundInDatabase[0]) {
      res.status(400).send(
        {
          status: 400,
          error: `пользователь с email ${signUpDto.email} уже существует - попробуйте зарегистрироваться с другим email`,
        },
        400,
      );
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

      const created = await this.usersService.create({
        email: signUpDto.email,
        password: await this.hashingService.hash(signUpDto.password),
        name: signUpDto.name,
        contactPhone: signUpDto.contactPhone,
        role: signUpDto.role,
      });

      const exitDto = {
        id: created.id,
        email: created.email,
        name: created.name,
      };

      res.status(200).send(exitDto);
    }
  }

  async signIn(signInDto: SignInDto, req: Request, session, res) {
    const foundInDatabase: any = await this.usersService.findOneByEmail(
      signInDto.email,
    );
    if (!foundInDatabase[0]?.email) {
      res.status(401).send(
        {
          status: 401,
          error: `пользователь не  существует или неверный пароль`,
        },
        401,
      );
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      foundInDatabase[0].password,
    );

    if (!isEqual) {
      res.status(401).send(
        {
          status: 401,
          error: `пользователь не  существует или неверный пароль`,
        },
        401,
      );
    } else {
      session.isAuthenticated = true;
      session.user = {
        email: foundInDatabase[0].email,
        name: foundInDatabase[0].name,
        id: foundInDatabase[0].id,
        role: foundInDatabase[0].role,
      };
      //  console.log(103, session, await session.id);
      const sessionDto = { sessionId: await session.id };
      const update = await this.userModel.findOneAndUpdate(
        { email: foundInDatabase[0].email },
        { $set: sessionDto },
        { new: true },
      );
      const exitDto = {
        email: await session.user.email,
        name: await session.user.name,
        contactPhone: await foundInDatabase[0].contactPhone,
      };

      res.status(200).send(exitDto);
    }
  }

  async logout(req, res) {
    await req.session.destroy((err) => {
      if (err) {
        res.status(520).send(
          {
            status: 520,
            error: `попробуйте еще раз - возникла ошибка ${err}`,
          },
          520,
        );
      }
      res.status(200).send({});
    });
  }
}
