import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
// import { CryptoService } from './crypto.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(credentials: LoginCredentialsDto) {
    const { username, password } = credentials;

    // try {
    const user = await this.usersService.getUserByMec(username);

    // if (!user) throw new UnauthorizedException('Invalid credentials!');
    if (!user) throw new NotFoundException('User Not Found!');

    const passwordMatches = await argon2.verify(user.password_hash, password);

    if (!passwordMatches)
      throw new BadRequestException('Passwords Not Matching!');

    const tokens = await this.getTokens(user.id, user.mec, user.name);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        mec: user.mec,
        name: user.name,
        role: user.role,
        workplace: user.workplace?.name || null,
        workplace_id: user.workplace?.id || null,
      },
      ...tokens,
    };
    // } catch (error) {
    //   console.error('[AuthService]: Login() failed!');
    //   console.error(error.message);

    //   throw new UnauthorizedException('Invalid credentials!-Z');
    // }
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  // async refreshTokens(userId: number, refreshToken: string) {
  async refreshTokens(userMec: number, refreshToken: string) {
    // console.log('on service rt');
    const user = await this.usersService.getUserByMec(userMec);

    if (!user || !user.refresh_token) {
      // console.log('user nnot found');
      // console.log(user);
      throw new ForbiddenException('Access Denied1');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refresh_token,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied2');

    const tokens = await this.getTokens(user.id, user.mec, user.name);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async changePassword(userID: number, changePasswDto: ChangePasswordDto) {
    return await this.usersService.changePassword(userID, changePasswDto);
  }

  async logout(userId: number) {
    return await this.usersService.update(userId, { refresh_token: null });
  }

  async getTokens(userId: number, mec: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          mec,
          username,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_DURATION'),
          // secret: this.configService.get<string>('tokens.accessToken.secret'),
          // expiresIn: this.configService.get<string>(
          //   'tokens.accessToken.duration',
          // ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          mec,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_DURATION'),
          // expiresIn: '7d',
          // secret: this.configService.get<string>('tokens.refreshToken.secret'),
          // expiresIn: this.configService.get<string>(
          //   'tokens.refreshToken.duration',
          // ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
