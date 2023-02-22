import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  // constructor() {
  //   super({
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     secretOrKey: process.env.REFRESH_TOKEN_SECRET,
  //     passReqToCallback: true,
  //   });
  // }
  constructor() {
    console.log('on rt guard');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  // async validate(payload: JwtPayload) {
  //   const { authUserId } = payload;

  //   const user = await this.usersService.getUserById(authUserId);

  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }

  //   return user;
  // }
  validate(req: Request, payload: any) {
    // const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    const refreshToken = req.cookies['refreshCookie'];

    console.log(payload);
    console.log(refreshToken);
    return { ...payload, refreshToken };
  }
}
function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshCookie'];
  }
  return token;
}
