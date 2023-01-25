import { Test, TestingModule } from '@nestjs/testing';
import { VentilatorsService } from './ventilators.service';

describe('VentilatorsService', () => {
  let service: VentilatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VentilatorsService],
    }).compile();

    service = module.get<VentilatorsService>(VentilatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
