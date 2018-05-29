const router = require('express').Router();
const {Skater, Game, Event, Roshambo, Attempt, Trick} = require('../models');

router.get('/:id', async (req, res) => {
  const game = await Game.findById(req.params.id, {
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

  res.send(game);
});

module.exports = router;
