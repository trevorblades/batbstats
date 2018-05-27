const router = require('express').Router();
const skaters = require('./skaters');

router.use('/skaters', skaters);

module.exports = router;
