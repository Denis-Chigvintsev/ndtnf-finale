import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';
import { SupportModule } from '../support/support.module';
import { SupportService } from '../support/support.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Support, SupportSchema } from '../support/entities/support.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Support.name,
        schema: SupportSchema,
      },
    ]),
    SupportModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
    SupportModule,
  ],
  providers: [WsGateway, WsService, SupportService],
})
export class WsModule {}
