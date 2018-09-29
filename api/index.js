import db from './models';
import resolvers from './resolvers';
import typeDefs from './schema';
import {ApolloServer} from 'apollo-server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {db}
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
