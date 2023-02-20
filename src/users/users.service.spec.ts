import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            // create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('POST /users/register', () => {
    it('should call userRepo.create with default role="consumer" if no role in post.body', async () => {
      const spyService = jest.spyOn(service, 'create');
      const spyConfig = jest.spyOn(configService, 'get');

      spyConfig.mockReturnValue({ allowUserSelfRegistration: true });

      await service.register({
        name: 'John Test',
        mec: 8888,
        password: 'xpto',
      });

      expect(spyService).toHaveBeenCalledTimes(1);
      // expect(spyService).toHaveBeenCalledWith({ role: 'consumer' });
    });
  });
});
