import express from 'express';
import games from './games';

const router = express.Router();
router.use('/games', games);

export default router;
