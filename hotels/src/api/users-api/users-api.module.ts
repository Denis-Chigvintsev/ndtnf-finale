import { Module } from '@nestjs/common';

import { UsersApiController } from './users-api.controller';
import { UsersService } from '../../modules/users/users.service';
import { UsersModule } from '../../modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../modules/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [UsersApiController],
  providers: [UsersService],
})
export class UsersApiModule {}
