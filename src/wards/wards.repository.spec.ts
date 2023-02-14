import { Test, TestingModule } from '@nestjs/testing';
import { WardsRepository } from './wards.repository';

describe('WardsRepository', () => {
  let repo;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WardsRepository,
          useValue: {
            clear: jest.fn(),
          },
        },
      ],
    }).compile();

    repo = moduleRef.get<WardsRepository>(WardsRepository);
  });

  describe('clear()', () => {
    it('should only allow the call of .clear() if NODE_ENV=test', () => {
      const mode = 'test';
      const res = repo.clear(mode);
      expect(res).toBeInstanceOf(Promise);
    });
  });
});
