/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { CreatedSupportDto } from './dto/created-support.dto';
import { ConfirmationDto } from './dto/confirmation.dto';
import { Support } from './entities/support.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name) private readonly supportModel: Model<Support>,
  ) {}

  async createSupportRequest(createSupportDto: CreateSupportDto, session) {
    const exitDto: CreatedSupportDto = {
      id: uuidv4(), /// обратить внимание, что это уже не входной DTO
      createdAt: new Date(),
      isActive: true,
      author: await session.user.name,
      authorId: session.user.id,

      messages: [
        {
          author: await session.user.name,
          authorId: await session.user.id,
          sentAt: new Date(),
          text: createSupportDto.text,
        },
      ],
    };
    console.log(exitDto);
    const createdSupportRequest = new this.supportModel(exitDto);
    return await createdSupportRequest.save();
  }

  async findListOfRequestsManager() {
    return await this.supportModel.find();
  }

  async findListOfRequestsClient(session) {
    console.log(95509, await session.user.id);
    return await this.supportModel.find({ authorId: await session.user.id });
  }

  async sendMessage(messageDto, session, id) {
    const found = await this.supportModel.find({ id: id });
    if (found) {
      console.log(890890, found[0]);
      console.log(890900, found[0]);

      const exitDto =
        // это то что пойдет на запись
        {
          authorId: await session.user.id,
          author: await session.user.name,
          sentAt: new Date(),
          text: messageDto.text,
        };
      found[0].messages.push(exitDto);
      return await this.supportModel.findOneAndUpdate(
        { id: id },
        { $set: found[0] },
        { new: true },
      );
    }
  }

  async getRequestById(session, id) {
    const found = await this.supportModel.find({ id: id });
    if (found) {
      console.log(890890, found[0]);
      console.log(890900, found[0]);
      return await this.supportModel.findOne({ id: id });
    }
  }

  async readConfirmation(confirmationDto: ConfirmationDto) {
    console.log(1600, confirmationDto);
    const { id, arrNumber } = confirmationDto;
    const found = await this.supportModel.find({ id: id });
    found[0].messages[+arrNumber].readAt = new Date();
    return await this.supportModel.findOneAndUpdate(
      { id: id },
      { $set: found[0] },
      { new: true },
    );
  }

  async findRequest(reqid) {
    return await this.supportModel.findOne({ id: reqid });
  }
}
