import auth from './auth';
import express from 'express';
import games from './games';
import skaters from './skaters';

const router = express.Router();
router.use('/auth', auth);
router.use('/games', games);
router.use('/skaters', skaters);

export default router;
