import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

type JwtPayload = {
  sub: number;
  mec: number;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    // const { authUserId } = payload;

    // const user = await this.usersService.getUserById(payload.sub);
    const user = await this.usersService.getUserByMec(payload.mec);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
    // return payload;
  }
}
