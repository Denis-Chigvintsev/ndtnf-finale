/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Session,
  Res,
} from '@nestjs/common';

import { SignUpDto } from '../../modules/iam/authentication/dto/sign-up.dto';
import { AuthenticationService } from '../../modules/iam/authentication/authentication.service';
import { SignInDto } from '../../modules/iam/authentication/dto/sign-in.dto';
import { SessionGuard } from '../../modules/iam/guards/session/session.guard';
import { AdminGuard } from '../../modules/iam/guards/admin/admin.guard';
import { FullCloseGuard } from '../../modules/iam/guards/full-close/full-close.guard';

@Controller('api')
export class IamApiController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  //2.3.3. Регистрация
  @Post('client/register')
  async signup(@Body() signUpDto: SignUpDto, @Res() res) {
    return await this.authenticationService.signUp(signUpDto, res);
  }

  @UseGuards(SessionGuard, AdminGuard)
  @Post('createuser/admin')
  async createuser(@Body() signUpDto: SignUpDto, @Res() res) {
    return await this.authenticationService.signUp(signUpDto, res);
  }

  // 2.3.1. Вход
  @Post('auth/login')
  async signin(
    @Body() signInDto: SignInDto,
    // @Res() res,
    // @Session() session: Record<string, any>,
    @Req() req,
    @Res() res,
    @Session() session: Record<string, any>,
  ) {
    return await this.authenticationService.signIn(
      signInDto,
      req,
      session,
      res,
    );
  }

  @Get('auth/logout')
  async logout(@Req() req, @Res() res) {
    return await this.authenticationService.logout(req, res);
  }

  @UseGuards(FullCloseGuard)
  @Get('ses')
  getSes(@Session() session: Record<string, any>, @Req() req) {
    console.log(session);
    console.log(session.id);
    console.log(12, req.cookies);
    const sesID = req.session.id;
    console.log(13, sesID);
    // session.authenticated = true;
    return session.id;
  }
}
