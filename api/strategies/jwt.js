import db from '../models';
import {ExtractJwt, Strategy} from 'passport-jwt';

export const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
export default new Strategy(
  {
    jwtFromRequest,
    secretOrKey: process.env.TOKEN_SECRET
  },
  async (payload, done) => {
    try {
      const user = await db.user.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
