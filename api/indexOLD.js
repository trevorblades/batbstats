import basicStrategy from './strategies/basic';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import jwtStrategy from './strategies/jwt';
import passport from 'passport';
import routes from './routes';
import {sequelize} from './models';

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(
  cors({
    origin: /^https?:\/\/(localhost(:\d{4})?|batbstats\.trevorblades\.com)$/
  })
);

passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/', routes);

sequelize
  .sync()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}`)
    )
  );
