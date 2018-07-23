import express from 'express';
import {Skater, Game, Event, Roshambo, Attempt, Trick} from '../models';

const router = express.Router();
router.get('/', async (req, res) => {
  const games = await Game.findAll({
    include: [
      Event,
      Skater,
      Roshambo,
      {
        model: Attempt,
        include: Trick
      }
    ],
    order: [[Attempt, 'id']]
  });

  res.send(games);
});

export default router;
