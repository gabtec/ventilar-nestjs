import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super({
      secretOrKey: 'topsecret21',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { authUserId } = payload;

    const user = await this.usersService.getUserById(authUserId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
