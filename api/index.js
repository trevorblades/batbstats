import cors from 'cors';
import express from 'express';
import routes from './routes';
import {sequelize} from './models';

const app = express();
app.use('/', routes);
app.use(
  cors({
    origin: /^https?:\/\/(localhost(:\d{4})?|batbstats.trevorblades.com)$/
  })
);

sequelize
  .sync()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}`)
    )
  );
