import bcrypt from 'bcryptjs';
import db from '../models';
import {BasicStrategy} from 'passport-http';

export default new BasicStrategy(async (email, password, done) => {
  try {
    const user = await db.user.findOne({where: {email}});
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        return done(null, user);
      }
    }

    return done(null, false);
  } catch (error) {
    return done(error);
  }
});
