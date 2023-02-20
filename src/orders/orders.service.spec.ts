import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import { WardsModule } from 'src/wards/wards.module';
import { WardsRepository } from 'src/wards/wards.repository';
import { WardsService } from 'src/wards/wards.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ConfigService,
        WardsService,
        WardsRepository,
        OrdersService,
        {
          provide: getRepositoryToken(Ward),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            save: (dto) => dto,
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if destination ward in not a park ', async () => {
    const spyService = jest.spyOn(service, 'checkDestinationWardIsPark');
    spyService.mockRejectedValue(
      new Error('The destination ward must be a park of ventilators'),
    );
    const testDto: CreateOrderDto = {
      patient_name: 'John Doe',
      patient_bed: 2,
      from_id: 2,
      to_id: 2,
      requested_by: '(0000) Some User',
      ventilator_id: null,
      obs: null,
      status: 'PENDING',
    };

    await expect(service.create(testDto)).rejects.toThrowError(
      'The destination ward must be a park of ventilators',
    );
  });

  it('should call save order if destination ward is a park ', async () => {
    const spyService = jest.spyOn(service, 'checkDestinationWardIsPark');
    spyService.mockResolvedValue(true);
    const testDto: CreateOrderDto = {
      patient_name: 'John Doe',
      patient_bed: 2,
      from_id: 2,
      to_id: 2,
      requested_by: '(0000) Some User',
      ventilator_id: null,
      obs: null,
      status: 'PENDING',
    };

    // await expect(service.create(testDto)).toHaveBeenCalledTimes(1);
    // await expect(service.create(testDto)).toHaveBeenCalledWith(testDto);
    expect(await service.create(testDto)).toEqual(testDto);
  });
});
