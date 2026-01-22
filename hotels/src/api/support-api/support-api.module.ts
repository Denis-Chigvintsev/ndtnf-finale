/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { SupportApiController } from './support-api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Support,
  SupportSchema,
} from '../../modules/support/entities/support.entity';
import { SupportService } from '../../modules/support/support.service';
import { User, UserSchema } from '../../modules/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Support.name,
        schema: SupportSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SupportApiController],
  providers: [SupportService],
})
export class SupportApiModule {}
