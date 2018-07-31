import createValidationMiddleware from '../middleware/validation';
import express from 'express';
import jwt from '../middleware/jwt';
import {STANCES} from '../common';
import {Skater} from '../models';
import {checkSchema} from 'express-validator/check';
import {matchedData} from 'express-validator/filter';

const router = express.Router();
router.use(jwt);

const validation = createValidationMiddleware(
  checkSchema({
    first_name: {
      exists: true,
      trim: true,
      isEmpty: {
        negated: true
      }
    },
    last_name: {
      exists: true,
      trim: true
    },
    stance: {
      isIn: {
        options: STANCES
      }
    },
    birth_date: {
      isISO8601: true
    },
    hometown: {
      exists: true,
      trim: true
    }
  })
);

router.put('/:id', validation, async (req, res) => {
  const skater = await Skater.findById(req.params.id);
  if (!skater) {
    res.sendStatus(404);
    return;
  }

  const data = matchedData(req);
  await skater.update(data);
  res.send(skater);
});

export default router;
