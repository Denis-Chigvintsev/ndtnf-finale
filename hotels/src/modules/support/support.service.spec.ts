import { Test, TestingModule } from '@nestjs/testing';
import { SupportService } from './support.service';
import { Support } from './entities/support.entity';
import { getModelToken } from '@nestjs/mongoose';

describe('SupportService', () => {
  let service: SupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportService,

        { provide: getModelToken(Support.name), useValue: {} },
      ],
    }).compile();

    service = module.get<SupportService>(SupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
