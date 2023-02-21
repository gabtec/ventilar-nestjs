import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
// import { JwtPayload } from './tokens-payload.interface';

type JwtPayload = {
  // sub: string;
  // username: string;
  authUserId: number;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
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
