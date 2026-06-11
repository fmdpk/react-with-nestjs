import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: 'refresh-secret', // Change this! Use env variable
    });
  }

  validate(payload: any) {
    if (!payload) throw new UnauthorizedException();
    return Promise.resolve({ userId: payload.sub, email: payload.email });
  }
}
