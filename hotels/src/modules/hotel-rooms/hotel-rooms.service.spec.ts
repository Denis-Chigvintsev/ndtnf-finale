import { Test, TestingModule } from '@nestjs/testing';
import { HotelRoomsService } from './hotel-rooms.service';
import { getModelToken } from '@nestjs/mongoose';
import { HotelRoom } from './entities/hotel-room.entity';
import { HotelsService } from '../hotels/hotels.service';
import { Hotel } from '../hotels/entities/hotel.entity';

describe('HotelRoomsService', () => {
  let service: HotelRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelRoomsService,
        HotelsService,
        { provide: getModelToken(HotelRoom.name), useValue: {} },
        { provide: getModelToken(Hotel.name), useValue: {} },
      ],
    }).compile();

    service = module.get<HotelRoomsService>(HotelRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
