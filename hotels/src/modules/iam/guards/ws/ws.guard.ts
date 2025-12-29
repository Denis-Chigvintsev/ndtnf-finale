/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import session from 'express-session';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/modules/users/entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieLite = require('cookie-lite');

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const cookie = context.switchToHttp().getRequest().handshake.headers.cookie;
    const browserSession = cookieLite
      .parse(cookie)
      .Netologie_Hotels?.slice(2, 34);
    const foundInDatabase = await this.userModel.findOne({
      sessionId: browserSession,
    });

    if (browserSession && foundInDatabase) {
      console.log('Пропускаю тебя твой-wsGuard');
      console.log(foundInDatabase);
      return true;
    } else {
      console.log('ПРОХОД ЗАКРЫТ- твой wsGuard');
      return false;
    }
  }
}
