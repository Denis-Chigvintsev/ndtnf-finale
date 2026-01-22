import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { HashingService } from '../hashing/hashing.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,

        { provide: getModelToken(User.name), useValue: {} },
        { provide: HashingService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
