import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies['refreshCookie'];

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
