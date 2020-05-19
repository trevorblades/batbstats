const jwt = require('jsonwebtoken');
const {ApolloServer} = require('apollo-server');
const {resolvers, typeDefs} = require('./schema');
const knex = require('knex');

const db = knex(process.env.DATABASE_URL);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  async context({req}) {
    const context = {db};

    if (req.headers.authorization) {
      const matches = req.headers.authorization.match(/bearer (.+)/i);
      if (matches) {
        try {
          const {sub} = jwt.verify(matches[1], process.env.JWT_SECRET);
          context.user = await db('users')
            .where('id', sub)
            .first();
        } catch (error) {
          // let errors pass
        }
      }
    }

    return context;
  }
});

server.listen({port: process.env.PORT}).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
