import express from 'express';
import passport from 'passport';

function sendToken(req, res) {
  return res.send(req.user.toJWT());
}

const router = express.Router();
router.post('/', passport.authenticate('basic', {session: false}), sendToken);
router.post(
  '/renew',
  passport.authenticate('jwt', {session: false}),
  sendToken
);

export default router;
