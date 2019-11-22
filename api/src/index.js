import {ApolloServer} from 'apollo-server';
import {resolvers, typeDefs} from './schema';
import {sequelize} from './db';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
});

sequelize
  .sync()
  .then(() => server.listen({port: process.env.PORT}))
  .then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
  });
