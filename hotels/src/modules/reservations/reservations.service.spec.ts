import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Hotel } from '../hotels/entities/hotel.entity';
import { HotelRoom } from '../hotel-rooms/entities/hotel-room.entity';

describe('ReservationsService', () => {
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,

        { provide: getModelToken(Reservation.name), useValue: {} },
        { provide: getModelToken(Hotel.name), useValue: {} },
        { provide: getModelToken(HotelRoom.name), useValue: {} },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
