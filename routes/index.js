import auth from './auth';
import express from 'express';

const router = express.Router();
router.get('/', (req, res) => res.sendStatus(200));
router.use('/auth', auth);

export default router;
