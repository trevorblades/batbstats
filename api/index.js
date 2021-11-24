import {ApolloServer} from 'apollo-server';
import {ApolloServerPluginLandingPageProductionDefault} from 'apollo-server-core';
import {DateTimeTypeDefinition, DateTypeDefinition} from 'graphql-scalars';
import {applyMiddleware} from 'graphql-middleware';
import {createContext} from 'dataloader-sequelize';
import {deny, shield} from 'graphql-shield';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {resolvers, typeDefs} from './schema.js';
import {sequelize} from './db.js';

const schema = makeExecutableSchema({
  typeDefs: [DateTypeDefinition, DateTimeTypeDefinition, typeDefs],
  resolvers
});

const permissions = shield({
  Mutation: deny
});

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context() {
    return {context: createContext(sequelize)};
  },
  plugins: [
    ApolloServerPluginLandingPageProductionDefault({
      graphRef: 'batbstats@current'
    })
  ]
});

sequelize.sync().then(async () => {
  const {url} = await server.listen({port: process.env.PORT});
  console.log(`🛹 Server ready at ${url}`);
});
