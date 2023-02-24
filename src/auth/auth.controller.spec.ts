import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    me: jest.fn(),
    changeMyPassword: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    // it('should return 401 if login fails: bacause username not a number', async () => {});

    it('should return 401 if login fails: bacause username not exists', async () => {
      const mockResp: any = {
        cookie: jest.fn(),
      };

      // mockAuthService.login.mockRejectedValueOnce(new UnauthorizedException());
      mockAuthService.login.mockRejectedValue(
        new NotFoundException('User Not Found!'),
      );

      await expect(
        authController.login({ username: 777777, password: 'b' }, mockResp),
      ).resolves.toThrow(UnauthorizedException);

      await expect(
        authController.login({ username: 777777, password: 'b' }, mockResp),
      ).resolves.toMatchObject({
        response: {
          statusCode: 401,
          message: 'Credênciais Inválidas',
          error: 'Unauthorized',
        },
        status: 401,
        message: 'Credênciais Inválidas',
        name: 'UnauthorizedException',
      });
      // expect(mockResp.cookie).not.toHaveBeenCalled();
    });

    it('should return 401 if login fails: bacause password does not match', async () => {
      const mockResp: any = {
        cookie: jest.fn(),
      };

      // mockAuthService.login.mockRejectedValueOnce(new UnauthorizedException());
      mockAuthService.login.mockRejectedValue(
        new BadRequestException('Passwords Not Matching!'),
      );

      await expect(
        authController.login({ username: 1, password: 'b' }, mockResp),
      ).resolves.toThrow(UnauthorizedException);

      await expect(
        authController.login({ username: 1, password: 'b' }, mockResp),
      ).resolves.toMatchObject({
        response: {
          statusCode: 401,
          message: 'Credênciais Inválidas',
          error: 'Unauthorized',
        },
        status: 401,
        message: 'Credênciais Inválidas',
        name: 'UnauthorizedException',
      });
    });

    it('should return 200 OK, on login succeedeed, set refreshToken inside a httpOnly cookie and return accessToken, and user data (without password)', async () => {
      const mockResp: any = {
        cookie: jest.fn(),
      };

      // mockAuthService.login.mockRejectedValueOnce(new UnauthorizedException());
      mockAuthService.login.mockResolvedValue({
        user: { id: 1, name: 'test' },
        accessToken: 'at',
        refreshToken: 'rt',
      });

      const resp: any = await authController.login(
        { username: 1, password: 'b' },
        mockResp,
      );

      expect(resp).toMatchObject({
        user: { id: 1, name: 'test' },
        accessToken: 'at',
      });

      expect(resp).not.toHaveProperty('refreshToken');
      expect(resp.user).not.toHaveProperty('password');
      expect(resp.user).not.toHaveProperty('password_hash');
      expect(mockResp.cookie).toHaveBeenCalledWith('refreshCookie', 'rt', {
        httpOnly: true,
        maxAge: 100000000,
      });
    });
  });

  // describe('me', () => {
  //   const tUser: User = {
  //     id: 2,
  //     name: 'John',
  //     role: 'consumer',
  //     mec: 4444,
  //     password_hash: 'aksdaskdjl',
  //     workplace_id: 2,
  //     workplace: null,
  //     created_at: '312323',
  //     updated_at: '312323',
  //   };
  //   it('should call service.me with a username, of type number', async () => {
  //     const spy = jest.spyOn(mockAuthService, 'me');

  //     await authController.me(tUser);

  //     expect(tUser.id).toBe(Number);
  //     expect(spy).toHaveBeenCalledTimes(1);
  //     expect(spy).toHaveBeenCalledWith(2);
  //   });

  //   // it('should call service.me with a username, of type number', async () => {
  //   //   const username = 1122;

  //   //   expect(spy).toHaveBeenCalledTimes(1);
  //   //   expect(spy).toHaveBeenCalledWith(mockDto);

  //   //   jest.spyOn(mockAuthService, 'me').mockImplementation(() => result);

  //   //   const resp = await authController.me();

  //   //   expect(resp).toBeInstanceOf(Array);
  //   //   expect(resp).toHaveLength(3);
  //   // });
  // });
});
