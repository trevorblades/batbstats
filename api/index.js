import cors from 'cors';
import express from 'express';
import {
  Skater,
  Game,
  Event,
  Roshambo,
  Attempt,
  Trick,
  sequelize
} from './models';

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  const data = await Game.findAll({
    include: [
      Event,
      Skater,
      Roshambo,
      {
        model: Attempt,
        include: Trick
      }
    ],
    order: [[Attempt, 'id']]
  });

  res.send(data);
});

sequelize
  .sync()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}`)
    )
  );
