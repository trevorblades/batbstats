const router = require('express').Router();
const {
  Skater,
  Game,
  Event,
  Roshambo,
  Attempt,
  Trick,
  Sequelize
} = require('../models');

router.get('/', async (req, res) => {
  const skaters = await Skater.findAll();
  res.send(skaters);
});

router.get('/:id', async (req, res) => {
  const skater = await Skater.findById(req.params.id, {
    include: {
      model: Game,
      include: [
        Event,
        Roshambo,
        {
          model: Skater,
          where: {
            id: {
              [Sequelize.Op.ne]: req.params.id
            }
          }
        },
        {
          model: Attempt,
          include: Trick,
          where: {
            skater_id: req.params.id
          }
        }
      ]
    }
  });

  res.send(skater);
});

module.exports = router;
