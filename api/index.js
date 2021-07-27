import {ApolloServer} from 'apollo-server';
import {DateTypeDefinition} from 'graphql-scalars';
import {createContext} from 'dataloader-sequelize';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {resolvers, typeDefs} from './schema.js';
import {sequelize} from './db.js';

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [DateTypeDefinition, typeDefs],
    resolvers
  }),
  context() {
    return {context: createContext(sequelize)};
  }
});

sequelize.sync().then(async () => {
  const {url} = await server.listen({port: process.env.PORT});
  console.log(`🚀 Server ready at ${url}`);
});
