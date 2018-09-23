import express from 'express';
import {
  Attempt,
  Event,
  Game,
  Replacement,
  Roshambo,
  Skater,
  Trick
} from '../models';

const router = express.Router();

const pageSize = 25;
router.get('/', async (req, res) => {
  let page = parseInt(req.query.page);
  if (isNaN(page)) {
    page = 1;
  }

  const games = await Game.findAll({
    include: [
      Event,
      Skater,
      Roshambo,
      Replacement,
      {
        model: Attempt,
        include: Trick
      }
    ],
    order: [[Attempt, 'id']],
    limit: pageSize,
    offset: pageSize * (page - 1)
  });

  res.send({
    games,
    next_page: games.length < pageSize ? null : page + 1
  });
});

export default router;
