const express = require('express');
const {Skater} = require('../models');

const router = express.Router();
router.get('/', async (req, res) => {
  const skaters = await Skater.findAll();
  res.send(skaters);
});

module.exports = router;
