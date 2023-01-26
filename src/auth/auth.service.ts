import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from './crypto.service';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: LoginCredentialsDto) {
    const { username, password } = credentials;

    try {
      const mec = parseInt(username, 10);

      if (isNaN(mec)) throw new BadRequestException('Invalid credentials!');

      const data = await this.usersService.getUserByMec(mec);
      const user = JSON.parse(data);
      if (!user) throw new BadRequestException('Invalid credentials!');

      const isAMatch = this.cryptoService.comparePassword(
        password,
        user.password_hash,
      );

      if (!isAMatch) throw new BadRequestException('Invalid credentials!');

      // create jwt content
      const jwtPayload: JwtPayload = { authUserId: user.id };
      const accessToken: string = await this.jwtService.signAsync(jwtPayload);

      return {
        user: {
          id: user.id,
          mec: user.mec,
          name: user.name,
          role: user.role,
          workplace: user.workplace.name,
        },
        accessToken,
        refreshToken: 'todo',
      };
    } catch (error) {
      throw new BadRequestException('Invalid credentials!');
    }
  }

  async me(id: number) {
    console.log('me' + id);
    return this.usersService.getUserById(id);
  }
}
