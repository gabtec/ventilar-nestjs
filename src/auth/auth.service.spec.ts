import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

import * as bcrypt from 'bcryptjs';

const mockUsersService = {
  getUserByMec: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '2m' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login()', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw UnauthorizedException if username can not be casted to a number (mec)', async () => {
      await expect(
        service.login({ username: 'not a number', password: 'somepassw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if username not existent on db', async () => {
      mockUsersService.getUserByMec.mockResolvedValueOnce(null);

      await expect(
        service.login({ username: '0', password: 'somepassw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it.only('should throw UnauthorizedException if password invalid', async () => {
      mockUsersService.getUserByMec.mockResolvedValueOnce(
        JSON.stringify({
          name: 'John',
          mec: 9999,
          password_hash: 'sdsadasdasd',
        }),
      );

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.login({ username: '4000', password: 'somepassw' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
