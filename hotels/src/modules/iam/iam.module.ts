import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

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
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthenticationService,
    //{
    // provide: APP_GUARD,
    // useClass: SessionGuard,
    //},
  ],

  controllers: [AuthenticationController],
})
export class IamModule {}
