/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SessionGuard } from '../guards/session/session.guard';
import { AdminGuard } from '../guards/admin/admin.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    console.log('signup', signUpDto);
    return await this.authenticationService.signUp(signUpDto);
  }

  @UseGuards(SessionGuard, AdminGuard)
  @Post('createuser/admin')
  async createuser(@Body() signUpDto: SignUpDto) {
    console.log('signup', signUpDto);
    return await this.authenticationService.signUp(signUpDto);
  }

  @Post('signin')
  async signin(
    @Body() signInDto: SignInDto,
    // @Res() res,
    // @Session() session: Record<string, any>,
    @Req() req,
    @Session() session: Record<string, any>,
  ) {
    console.log('signin');
    return await this.authenticationService.signIn(signInDto, req, session);
  }

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
