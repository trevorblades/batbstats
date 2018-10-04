import cors from 'cors';
import db from './models';
import express from 'express';
import resolvers from './resolvers';
import routes from './routes';
import typeDefs from './schema';
import {ApolloServer} from 'apollo-server-express';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {db}
});

const app = express();
app.use('/', routes);
app.use(
  cors({
    origin: /^https?:\/\/(localhost(:\d{4})?|batbstats\.trevorblades\.com)$/,
    credentials: true
  })
);

server.applyMiddleware({
  app,
  cors: false
});

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
