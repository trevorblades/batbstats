import schema from './schema';
import {ApolloServer} from 'apollo-server';
import {sequelize} from './db';

const server = new ApolloServer({schema});

sequelize
  .sync()
  .then(() =>
    server.listen().then(({url}) => console.log(`🚀 Server ready at ${url}`))
  );
