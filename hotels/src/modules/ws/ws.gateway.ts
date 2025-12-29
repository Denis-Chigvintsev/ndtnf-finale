/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WsService } from './ws.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, Session, UseGuards } from '@nestjs/common';
import { MessageDtoWS } from './dto/message.dto.ws';
import { WsGuard } from '../iam/guards/ws/ws.guard';
import session from 'express-session';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Support } from '../support/entities/support.entity';
import { ReadDto } from './dto/ws.read.dto.ws';
const ios = require('socket.io-express-session');

@WebSocketGateway({
  cors: {
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class WsGateway implements OnModuleInit {
  constructor(
    private readonly wsService: WsService,
    @InjectModel(Support.name) private readonly supportModel: Model<Support>,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('connected', socket.id, socket.handshake.headers.cookie);
      console.log('connected');
    });
  }

  afterInit(@Session() session, socket: Socket) {}

  @UseGuards(WsGuard)
  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() messageDtoWS: MessageDtoWS,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log(100100100, messageDtoWS);
    // console.log(999, 111, client.handshake.headers.cookie);

    const updated = await this.wsService.updateByMessage(messageDtoWS, client);

    if (updated) {
      this.server.emit('onMessage', messageDtoWS);
    } else {
      this.server.emit('onMessage', { error: 'incorrect id' });
    }

    console.log(111222, client.id);
    client.join(messageDtoWS.reqid);

    this.server
      .to(messageDtoWS.reqid)
      .emit(
        'chatList',
        await this.supportModel.findOne({ id: messageDtoWS.reqid }),
      );
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('readConf')
  async handleReadConfirmation(
    @MessageBody() readDto: ReadDto,
    @ConnectedSocket() client: Socket,
  ) {
    const updated = await this.wsService.readConfirmation(readDto, client);

    this.server
      .to(client.id)
      .emit('chatList', await this.supportModel.findOne({ id: readDto.reqid }));
  }
}
