import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret-key-bel-sekolah-otomatis',
    });
  }

  async validate(payload: any) {
    // Apapun yang di-return di sini akan disisipkan ke object `req.user`
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}