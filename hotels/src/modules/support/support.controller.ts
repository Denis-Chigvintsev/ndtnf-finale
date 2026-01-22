import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { ConfirmationDto } from './dto/confirmation.dto';
import { SessionGuard } from '../iam/guards/session/session.guard';
import { ManagerGuard } from '../iam/guards/manager/manager.guard';
import { MessageDto } from './dto/message.dto';
import { FullCloseGuard } from '../iam/guards/full-close/full-close.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard)
  @Post('support-request/client')
  async createSupportRequest(
    @Body() createSupportDto: CreateSupportDto,
    @Session() session,
  ) {
    return await this.supportService.createSupportRequest(
      createSupportDto,
      session,
    );
  }
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard, ManagerGuard)
  @Get('support-request/manager')
  async findListOfRequestsManager() {
    return await this.supportService.findListOfRequestsManager();
  }

  @UseGuards(SessionGuard)
  @Get('support-request/get/:id') // id это support request id
  async getRequestById(@Param('id') id: string, @Session() session) {
    return await this.supportService.getRequestById(session, id);
  }
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard)
  @Get('support-request/client')
  async findListOfRequestsClient(@Session() session) {
    return await this.supportService.findListOfRequestsClient(session);
  }
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard)
  @Post('support-request/message/client/manager/:id') // id это support request id
  async sendMessage(
    @Body() messageDto: MessageDto,
    @Param('id') id: string,
    @Session() session,
  ) {
    return await this.supportService.sendMessage(messageDto, session, id);
  }
  @UseGuards(FullCloseGuard)
  @UseGuards(SessionGuard)
  @Post('support-request/read-confirmation/client/manager/:id') //id - support-request //arr-number это номер в массиве сообщений
  readConfirmation(
    @Body() confirmationDto: ConfirmationDto,
    @Param('id') id: string,
    @Res() res,
    @Req() req,
  ) {
    return this.supportService.readConfirmation(confirmationDto, id, res, req);
  }
}
