import { Test } from '@nestjs/testing';
import { WardsService } from './wards.service';
import { WardsController } from './wards.controller';
import { AuthGuard } from '@nestjs/passport';

describe('WardsController', () => {
  let wardsController: WardsController;

  const mockWardService = {
    getAll: jest.fn(),
    create: jest.fn(),
    getAllVentilatorsInAPark: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WardsController],
      providers: [WardsService],
    })
      .overrideProvider(WardsService)
      .useValue(mockWardService)
      .overrideGuard(AuthGuard())
      .useValue({})
      .compile();

    wardsController = moduleRef.get<WardsController>(WardsController);
  });

  describe('controller', () => {
    it('should be defined', async () => {
      expect(wardsController).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should call service.getAll with NO arguments', async () => {
      const spy = jest.spyOn(mockWardService, 'getAll');

      await wardsController.getAll();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith();
    });

    it('should call service.getAll and receive an array of wards', async () => {
      const result = ['ward1', 'ward2', 'ward3'];
      jest.spyOn(mockWardService, 'getAll').mockImplementation(() => result);

      const resp = await wardsController.getAll();

      expect(resp).toBeInstanceOf(Array);
      expect(resp).toHaveLength(3);
    });
  });

  describe('createWard', () => {
    it('should call service.create with a dto', async () => {
      const mockDto = { name: 'fake ward', belongs_to: 'me' };
      const spyC = jest.spyOn(mockWardService, 'create');

      await wardsController.createWard(mockDto);

      expect(spyC).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledWith(mockDto);
    });

    it('should call service.create and receive the created ward object', async () => {
      const result = {
        id: 9,
        name: 'ward brand new',
        belongs_to: 'ME',
        created_at: '2023-01-20T10:15:30.000Z',
        updated_at: '2023-01-20T10:15:30.000Z',
      };

      jest.spyOn(mockWardService, 'create').mockImplementation(() => result);

      const resp = await wardsController.createWard({
        name: 'fake ward',
        belongs_to: 'me',
      });

      expect(resp).toHaveProperty('id');
      expect(resp).toHaveProperty('name');
      expect(resp).toHaveProperty('belongs_to');
      expect(resp).toHaveProperty('created_at');
      expect(resp).toHaveProperty('updated_at');
      expect(Object.keys(resp)).toHaveLength(5);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
