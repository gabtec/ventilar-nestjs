import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
// import { CryptoService } from './crypto.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    // private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(credentials: LoginCredentialsDto) {
    const { username, password } = credentials;

    try {
      const mec = parseInt(username, 10);

      if (isNaN(mec)) throw new BadRequestException('Invalid credentials!');

      const data = await this.usersService.getUserByMec(mec);
      const user = JSON.parse(data);
      if (!user) throw new BadRequestException('Invalid credentials!');

      // const isAMatch = await this.cryptoService.comparePassword(
      //   password,
      //   user.password_hash,
      // );

      const isAMatch = await bcrypt.compare(password, user.password_hash);

      if (!isAMatch) throw new BadRequestException('Invalid credentials!');

      // create jwt content
      const jwtPayload: JwtPayload = { authUserId: user.id };
      const accessToken: string = await this.jwtService.signAsync(jwtPayload);
      // const accessToken: string = await this.jwtService.signAsync(jwtPayload, {
      //   secret: this.configService.get('JWT_TIME'),
      //   expiresIn: this.configService.get('JWT_TIME'),
      // });
      const refreshToken: string = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('REFRESH_TOKEN_TIME'),
        expiresIn: this.configService.get('REFRESH_TOKEN_TIME'),
      });

      return {
        user: {
          id: user.id,
          mec: user.mec,
          name: user.name,
          role: user.role,
          workplace: user.workplace.name,
          workplace_id: user.workplace.id,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid credentials!');
    }
  }

  async changePassword(userID: number, changePasswDto: ChangePasswordDto) {
    return await this.usersService.changePassword(userID, changePasswDto);
  }
}
