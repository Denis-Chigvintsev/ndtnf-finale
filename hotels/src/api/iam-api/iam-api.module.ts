/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { IamModule } from '../../modules/iam/iam.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../modules/users/entities/user.entity';
import { UsersModule } from '../../modules/users/users.module';
import { HashingService } from '../../modules/iam/hashing/hashing.service';
import { BcryptService } from '../../modules/iam/hashing/bcrypt.service';
import { AuthenticationService } from '../../modules/iam/authentication/authentication.service';
import { IamApiController } from './iam-api.controller';

@Module({
  imports: [
    IamModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
  ],

  controllers: [IamApiController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthenticationService,
  ],
})
export class IamApiModule {}
