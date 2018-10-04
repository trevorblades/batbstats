import basicStrategy from '../strategies/basic';
import express from 'express';
import jwt from '../middleware/jwt';
import jwtStrategy from '../strategies/jwt';
import passport from 'passport';

function sendToken(req, res) {
  return res.send(req.user.toJWT());
}

passport.use(basicStrategy);
passport.use(jwtStrategy);

const router = express.Router();
router.use(passport.initialize());

router.post('/', passport.authenticate('basic', {session: false}), sendToken);
router.post('/renew', jwt, sendToken);

export default router;
