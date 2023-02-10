import { AuthGuard } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    me: jest.fn(),
    changeMyPassword: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(AuthGuard())
      .useValue({})
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call service.login with TWO arguments', async () => {
      const spy = jest.spyOn(mockAuthService, 'login');

      const mockDto = { username: 'a', password: 'b' };
      await authController.login(mockDto);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(mockDto);
    });

    it('should call service.login and receive an User with tokens (access and refresh)', async () => {
      const mockDto = { username: 'a', password: 'b' };
      const result = { user: 'a', accessToken: 'b', refreshToken: 'c' };

      jest.spyOn(mockAuthService, 'login').mockImplementation(() => result);

      const resp = await authController.login(mockDto);

      expect(resp).toReturnWith(result);
    });
  });

  describe('me', () => {
    const tUser: User = {
      id: 2,
      name: 'John',
      role: 'consumer',
      mec: 4444,
      password_hash: 'aksdaskdjl',
      workplace_id: 2,
      workplace: null,
      created_at: '312323',
      updated_at: '312323',
    };
    it('should call service.me with a username, of type number', async () => {
      const spy = jest.spyOn(mockAuthService, 'me');

      await authController.me(tUser);

      expect(tUser.id).toBe(Number);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(2);
    });

    // it('should call service.me with a username, of type number', async () => {
    //   const username = 1122;

    //   expect(spy).toHaveBeenCalledTimes(1);
    //   expect(spy).toHaveBeenCalledWith(mockDto);

    //   jest.spyOn(mockAuthService, 'me').mockImplementation(() => result);

    //   const resp = await authController.me();

    //   expect(resp).toBeInstanceOf(Array);
    //   expect(resp).toHaveLength(3);
    // });
  });
});
