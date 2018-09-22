import auth from './auth';
import express from 'express';
import games from './games';
import skaters from './skaters';
import tricks from './tricks';

const router = express.Router();
router.get('/', (req, res) => res.sendStatus(200));
router.use('/auth', auth);
router.use('/games', games);
router.use('/skaters', skaters);
router.use('/tricks', tricks);

export default router;
