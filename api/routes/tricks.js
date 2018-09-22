import createValidationMiddleware from '../middleware/validation';
import express from 'express';
import jwt from '../middleware/jwt';
import {VARIATIONS} from '../common';
import {Trick} from '../models';
import {checkSchema} from 'express-validator/check';
import {matchedData} from 'express-validator/filter';

const router = express.Router();
router.use(jwt);

const int = {
  isInt: true,
  toInt: true
};

const validation = createValidationMiddleware(
  checkSchema({
    name: {
      exists: true,
      trim: true,
      isEmpty: {
        negated: true
      }
    },
    variation: {
      isIn: {
        options: [[...VARIATIONS, '']]
      },
      customSanitizer: {
        options: value => value || null
      }
    },
    flip: int,
    shuv: int,
    spin: int,
    other: {
      isBoolean: true
    }
  })
);

router.put('/:id', validation, async (req, res) => {
  const trick = await Trick.findById(req.params.id);
  if (!trick) {
    res.sendStatus(404);
    return;
  }

  const data = matchedData(req);
  await trick.update(data);
  res.send(trick);
});

export default router;
