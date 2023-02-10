import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WardsService } from './wards.service';
import { Ward } from './entities/ward.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';

describe('WardsService', () => {
  let service: WardsService;
  let repository: Repository<Ward>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WardsService,
        {
          provide: getRepositoryToken(Ward),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WardsService>(WardsService);
    repository = module.get(getRepositoryToken(Ward));
  });

  it('should have a service defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a repository defined', () => {
    expect(repository).toBeDefined();
  });
});
