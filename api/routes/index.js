const router = require('express').Router();
const games = require('./games');
const skaters = require('./skaters');

router.use('/games', games);
router.use('/skaters', skaters);

module.exports = router;
