import basicStrategy from './strategies/basic';
import cors from 'cors';
import db from './models';
import express from 'express';
import jwt from 'jsonwebtoken';
import jwtStrategy, {jwtFromRequest} from './strategies/jwt';
import passport from 'passport';
import resolvers from './resolvers';
import routes from './routes';
import typeDefs from './schema';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';

const context = ({req}) => {
  let user;
  const token = jwtFromRequest(req);
  if (token) {
    try {
      user = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  }

  return {db, user};
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

const app = express();
app.use(passport.initialize());
app.use(
  cors({
    origin: /^https?:\/\/(localhost(:\d{4})?|batbstats\.trevorblades\.com)$/
  })
);

passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/', routes);
server.applyMiddleware({app});

db.sequelize
  .sync()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(
        `🚀 Server ready at http://localhost:${process.env.PORT}${
          server.graphqlPath
        }`
      )
    )
  );
