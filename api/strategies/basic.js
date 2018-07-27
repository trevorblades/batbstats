import bcrypt from 'bcryptjs';
import {BasicStrategy} from 'passport-http';
import {User} from '../models';

export default new BasicStrategy(async (email, password, done) => {
  try {
    const user = await User.findOne({where: {email}});
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
