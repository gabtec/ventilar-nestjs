import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
// import { CryptoService } from './crypto.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import { JwtPayload } from './jwt/tokens-payload.interface';
import * as bcrypt from 'bcryptjs';
// import * as argon2 from 'argon2';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(credentials: LoginCredentialsDto) {
    const { username, password } = credentials;

    let mec: number;

    try {
      mec = parseInt(username, 10);
      if (isNaN(mec)) throw new UnauthorizedException('Invalid credentials!');
    } catch (error) {
      console.log('Username must be a number: mec');
      // throw new BadRequestException('Invalid credentials!');
      throw new UnauthorizedException('Invalid credentials!');
    }

    try {
      const data = await this.usersService.getUserByMec(mec);
      const user = JSON.parse(data);
      if (!user) throw new UnauthorizedException('Invalid credentials!');

      // const isAMatch = await this.cryptoService.comparePassword(
      //   password,
      //   user.password_hash,
      // );

      const isAMatch = await bcrypt.compare(password, user.password_hash);

      if (!isAMatch) throw new UnauthorizedException('Invalid credentials!');

      // create jwt content
      const jwtPayload: JwtPayload = { authUserId: user.id };
      const accessToken: string = await this.jwtService.signAsync(jwtPayload);
      // const accessToken: string = await this.jwtService.signAsync(jwtPayload, {
      //   secret: this.configService.get('JWT_TIME'),
      //   expiresIn: this.configService.get('JWT_TIME'),
      // });
      const refreshToken: string = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('tokens.refreshToken.secret'),
        expiresIn: this.configService.get('tokens.refreshToken.duration'),
      });

      return {
        user: {
          id: user.id,
          mec: user.mec,
          name: user.name,
          role: user.role,
          workplace: user.workplace?.name || null,
          workplace_id: user.workplace?.id || null,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // console.log(error.message);
      throw error;
    }
  }

  async refreshTokens(userID: number, refreshToken: string) {
    // TODO
    const user = await this.usersService.getUserById(userID);

    if (!user || !user.refresh_token_hash) {
      throw new ForbiddenException('Access Denied');
    }

    if (user.refresh_token_hash !== refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isValid = await this.jwtService.verifyAsync(refreshToken);
    if (!isValid) {
      throw new ForbiddenException('Access Denied');
    }

    // create new cookie with refreshToken
    const tokens = await this.getTokens(user.id, user.name);

    // TODO save hashed refresh token on database
    //....

    // return the new accessToken
    return tokens;
  }

  async changePassword(userID: number, changePasswDto: ChangePasswordDto) {
    return await this.usersService.changePassword(userID, changePasswDto);
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
