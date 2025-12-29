/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { SupportService } from '../support/support.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Support } from '../support/entities/support.entity';
import { User } from '../users/entities/user.entity';
import { MessageDtoWS } from './dto/message.dto.ws';
import session from 'express-session';
const cookieLite = require('cookie-lite');

@Injectable()
export class WsService {
  constructor(
    private readonly supportService: SupportService,
    @InjectModel(Support.name) private readonly supportModel: Model<Support>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async updateByMessage(messageDtoWS, client) {
    const cookie = client.handshake.headers.cookie;
    const sessionId = cookieLite.parse(cookie).Netologie_Hotels?.slice(2, 34);

    const foundUser = await this.userModel.findOne({
      sessionId: sessionId,
    });

    if (foundUser) {
      const exitDto = {
        //это то что пойдет на запись
        authorId: await foundUser.id,
        author: foundUser.name,
        sentAt: new Date(),
        text: messageDtoWS.text,
      };

      const found = await this.supportModel.findOne({ id: messageDtoWS.reqid });

      //const found = await this.supportModel.findOneAndUpdate({});
      //if (found) {
      //  return true;
      // }
      // return false;

      if (found) {
        found.messages.push(exitDto);

        return await this.supportModel.findOneAndUpdate(
          { id: messageDtoWS.reqid },
          { $set: found },
          { new: true },
        );
      }
    }
  }

  async readConfirmation(readDto, client) {
    const cookie = client.handshake.headers.cookie;
    const sessionId = cookieLite.parse(cookie).Netologie_Hotels?.slice(2, 34);

    const foundUser = await this.userModel.findOne({
      sessionId: sessionId,
    });

    const found1 = await this.supportModel.findOne({
      id: readDto.reqid,
    });

    console.log(-200000, foundUser?.name);
    console.log(-200000001, found1?.messages[readDto.messageNumber]);

    if (
      found1 &&
      foundUser?.name !== found1.messages[readDto.messageNumber].author
    ) {
      const correctedFound = found1.messages[readDto.messageNumber];
      correctedFound.readAt = new Date();

      return await this.supportModel.findOneAndUpdate(
        { id: readDto.reqid },
        { $set: found1 },
        { new: true },
      );
    }
  }
}
