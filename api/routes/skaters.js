const router = require('express').Router();
const {Skater, Game, Trick, Attempt} = require('../models');

router.get('/', async (req, res) => {
  const skaters = await Skater.findAll();
  res.send(skaters);
});

router.get('/:id', async (req, res) => {
  const skater = await Skater.findById(req.params.id, {
    include: {
      model: Game,
      include: {
        model: Attempt,
        include: Trick
      }
    }
  });
  res.send(skater);
});

module.exports = router;
