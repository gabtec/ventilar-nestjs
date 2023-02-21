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
      const user = await this.usersService.getUserByMec(mec);
      // const user = JSON.parse(data);
      if (!user) throw new UnauthorizedException('Invalid credentials!');

      // const isAMatch = await this.cryptoService.comparePassword(
      //   password,
      //   user.password_hash,
      // );

      const passwordMatches = await argon2.verify(user.password_hash, password);
      if (!passwordMatches)
        throw new UnauthorizedException('Invalid credentials!');
      console.log(user);

      // const tokens = await this.getTokens(user.id, user.name);
      const tokens = await this.getTokens(user.id, user.mec, user.name);
      console.log(tokens);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      // const isAMatch = await bcrypt.compare(password, user.password_hash);

      // if (!isAMatch) throw new UnauthorizedException('Invalid credentials!');

      // // create jwt content
      // const jwtPayload: JwtPayload = { authUserId: user.id };
      // const accessToken: string = await this.jwtService.signAsync(jwtPayload);
      // // const accessToken: string = await this.jwtService.signAsync(jwtPayload, {
      // //   secret: this.configService.get('JWT_TIME'),
      // //   expiresIn: this.configService.get('JWT_TIME'),
      // // });
      // const refreshToken: string = await this.jwtService.signAsync(jwtPayload, {
      //   secret: this.configService.get('tokens.refreshToken.secret'),
      //   expiresIn: this.configService.get('tokens.refreshToken.duration'),
      // });

      // response
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
    } catch (error) {
      // console.log(error.message);
      throw error;
    }
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
    // TODO
    const user = await this.usersService.getUserByMec(userMec);

    console.log('on refreseh auth.service');
    console.log(user);
    console.log(refreshToken);
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied1');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refresh_token,
      refreshToken,
    );

    console.log('is a match');
    console.log(refreshTokenMatches);
    console.log(user.refresh_token);
    console.log(refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied2');

    // create new cookie with refreshToken
    const tokens = await this.getTokens(user.id, user.mec, user.name);

    // TODO save hashed refresh token on database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // return the new accessToken
    return tokens;
  }

  async changePassword(userID: number, changePasswDto: ChangePasswordDto) {
    return await this.usersService.changePassword(userID, changePasswDto);
  }

  async logout(userId: number) {
    this.usersService.update(userId, { refresh_token: null });
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
          // secret: this.configService.get<string>('JWT_SECRET'),
          // expiresIn: '15m',
          secret: this.configService.get<string>('tokens.accessToken.secret'),
          expiresIn: this.configService.get<string>(
            'tokens.accessToken.duration',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          mec,
          username,
        },
        {
          // secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          // expiresIn: '7d',
          secret: this.configService.get<string>('tokens.refreshToken.secret'),
          expiresIn: this.configService.get<string>(
            'tokens.refreshToken.duration',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
