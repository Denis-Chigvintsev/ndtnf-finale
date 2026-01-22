import { Test, TestingModule } from '@nestjs/testing';
import { WsService } from './ws.service';
import { SupportService } from '../support/support.service';
import { getModelToken } from '@nestjs/mongoose';
import { Support } from '../support/entities/support.entity';
import { User } from '../users/entities/user.entity';

describe('WsService', () => {
  let service: WsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WsService,
        SupportService,
        { provide: getModelToken(Support.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    service = module.get<WsService>(WsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
