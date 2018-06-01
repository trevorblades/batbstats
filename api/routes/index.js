const router = require('express').Router();
const insertGames = require('../../migration/insert-games');
const games = require('./games');
const skaters = require('./skaters');

router.use('/games', games);
router.use('/skaters', skaters);

router.get('/migration/insert', async (req, res) => {
  const inserted = await insertGames();
  res.send(inserted);
});

module.exports = router;
