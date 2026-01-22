/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Session,
  Res,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ManagerGuard } from '../../modules/iam/guards/manager/manager.guard';
import { SessionGuard } from '../../modules/iam/guards/session/session.guard';
import { ConfirmationDto } from '../../modules/support/dto/confirmation.dto';
import { CreateSupportDto } from '../../modules/support/dto/create-support.dto';
import { MessageDto } from '../../modules/support/dto/message.dto';
import { SupportService } from '../../modules/support/support.service';
import { User } from '../../modules/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Controller('api')
export class SupportApiController {
  constructor(
    private readonly supportService: SupportService,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  //2.5.1. Создание обращения в поддержку
  @UseGuards(SessionGuard)
  @Post('client/support-requests')
  createSupportRequest(
    @Body() createSupportDto: CreateSupportDto,
    @Session() session,
    @Res() res,
  ) {
    this.supportService
      .createSupportRequest(createSupportDto, session)
      .then((data) => {
        // console.log(data);
        const createdAt = new Date(data.createdAt);
        const exitDto = [
          {
            id: data.id,
            isActive: data.isActive,
            createdAt: createdAt.toLocaleDateString('ru-RU'),
          },
        ];
        res.status(200).send(exitDto);
      });
  }
  //2.5.3. Получение списка обращений в поддержку для менеджера
  @UseGuards(SessionGuard, ManagerGuard)
  @Get('manager/support-requests')
  findListOfRequestsManager(@Res() res) {
    type Client = {
      id: string;
      name: string;
      email: string;
      contactPhone: string;
    };

    interface IexitDto {
      id: string;
      createdAt: string;
      isActive: boolean;
      client: Client;
    }

    let exitArr: any[] = [];

    this.supportService.findListOfRequestsManager().then((data) => {
      data.map((el) => {
        const createdAt = new Date(el.createdAt);
        let email;
        let contactPhone;

        this.userModel
          .findOne({ id: el.authorId })
          .then((user) => {
            email = user?.email;
            contactPhone = user?.contactPhone;
          })
          .then(() => {
            let client = {
              id: el.authorId,
              name: el.author,
              email: email,
              contactPhone: contactPhone,
            };

            let exitDto: IexitDto = {
              id: el.id,
              createdAt: createdAt.toLocaleDateString('ru-RU'),
              isActive: el.isActive,
              client: client,
            };

            exitArr.push(exitDto);
            if (exitArr.length == data.length) {
              res.status(200).send(exitArr);
            }
          });
      });
    });
  }

  // 2.5.4. Получение истории сообщений из обращения в техподдержку
  @UseGuards(SessionGuard)
  @Get('common/support-requests/:id/messages') // id это support request id
  getRequestById(@Param('id') id: string, @Session() session, @Res() res) {
    this.supportService.getRequestById(session, id).then((chat) => {
      type Author = { id: string; name: string };
      interface IexitDto {
        id: string;
        createdAt: string;
        text: string;
        readAt: string;
        author: Author;
      }

      let exitArr: any[] = [];
      let text1: string;

      chat?.messages.map((el) => {
        const createdAt = new Date(chat.createdAt);

        if (el.text) text1 = el.text;

        let author1: Author = { id: '', name: '' };
        if (el.authorId) author1.id = el.authorId;
        if (el.author) author1.name = el.author;

        let exitDto: IexitDto = {
          id: uuidv4(),
          createdAt: createdAt.toLocaleDateString('ru-RU'),
          text: text1,
          readAt: '',
          author: author1,
        };

        exitArr.push(exitDto);

        if (chat.messages.length == exitArr.length) {
          res.status(200).send(exitArr);
        }
      });
    });
  }

  //2.5.2. Получение списка обращений в поддержку для клиента
  @UseGuards(SessionGuard)
  @Get('client/support-requests')
  findListOfRequestsClient(@Session() session, @Res() res) {
    const exitArr: any = [];

    interface IexitDto {
      id: string;
      createdAt: string;
      isActive: boolean;
    }

    this.supportService.findListOfRequestsClient(session).then((data) => {
      data.map((el) => {
        let createdAt;
        if (el.createdAt) createdAt = new Date(el.createdAt);

        let id;
        if (el.id) id = el.id;

        let isActive;
        if (el.isActive) isActive = el.isActive;

        let exitDto: IexitDto = {
          id: id,
          createdAt: createdAt.toLocaleDateString('ru-RU'),
          isActive: isActive,
        };

        if (exitDto) exitArr.push(exitDto);
        if (exitArr.length == data.length) res.status(200).send(exitArr);
      });
    });
  }
  //2.5.5. Отправка сообщения
  @UseGuards(SessionGuard)
  @Post('common/support-requests/:id/messages') // id это support request id POST /api/common/support-requests/:id/messages
  sendMessage(
    @Body() messageDto: MessageDto,
    @Param('id') id: string,
    @Session() session,
    @Res() res,
  ) {
    type Author = {
      id: string;
      name: string;
    };

    interface IexitDto {
      id: string;
      createdAt: string;
      isActive: boolean;
      author: Author;
      text: string;
    }

    this.supportService.sendMessage(messageDto, session, id).then((data) => {
      let message;
      if (data) message = data.messages[data.messages.length - 1];

      const author: Author = { id: message.authorId, name: message.author };
      const exitDto: IexitDto = {
        id: data?.id,
        createdAt: '',
        isActive: true,
        text: message.text,
        author: author,
      };
      if (data?.isActive) exitDto.isActive = data?.isActive;
      if (data?.createdAt) {
        const date = new Date(data?.createdAt);
        exitDto.createdAt = date.toLocaleDateString('ru-RU');
      }
      res.status(200).send(exitDto);
    });
  }
  ///2.5.6. Отправка события, что сообщения прочитаны
  @UseGuards(SessionGuard)
  @Post('common/support-requests/:id/messages/read') //id - support-request number //
  readConfirmation(
    @Body() confirmationDto: ConfirmationDto,
    @Param('id') id: string,
    @Res() res,
    @Req() req,
  ) {
    //console.log(1917, confirmationDto, id);
    this.supportService.readConfirmation(confirmationDto, id, res, req);
  }
}
