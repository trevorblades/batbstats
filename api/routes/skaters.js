const express = require('express');
const {Skater} = require('../models');

const router = express.Router();
router.get('/', async (req, res) => {
  const skaters = await Skater.findAll();
  res.send(skaters);
});

router.get('/:id', async (req, res) => {
  const skater = await Skater.findById(req.params.id);
  res.send(skater);
});

module.exports = router;
