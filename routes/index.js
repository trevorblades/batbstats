const express = require('express');
const skaters = require('./skaters');

const router = express.Router();
router.get('/', (req, res) =>
  res.send({
    id: 123
  })
);

router.use('/skaters', skaters);

module.exports = router;
