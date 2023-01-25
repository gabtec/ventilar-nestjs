import { Test, TestingModule } from '@nestjs/testing';
import { VentilatorsController } from './ventilators.controller';

describe('VentilatorsController', () => {
  let controller: VentilatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentilatorsController],
    }).compile();

    controller = module.get<VentilatorsController>(VentilatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
