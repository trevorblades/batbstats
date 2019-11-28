import {ApolloServer} from 'apollo-server';
import {User, sequelize} from './db';
import {resolvers, typeDefs} from './schema';
import {verify} from 'jsonwebtoken';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  async context({req}) {
    if (req.headers.authorization) {
      const matches = req.headers.authorization.match(/Bearer (.+)/i);
      if (matches) {
        try {
          const {sub} = verify(matches[1], process.env.TOKEN_SECRET);
          const user = await User.findByPk(sub);
          return {user};
        } catch (error) {
          // let errors pass
        }
      }
    }

    return {};
  }
});

sequelize
  .sync()
  .then(() => server.listen({port: process.env.PORT}))
  .then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
  });
