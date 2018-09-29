import {ApolloServer, gql} from 'apollo-server';
import {Game} from './models';

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type Skater {
    id: ID
    first_name: String
    last_name: String
    full_name: String
    stance: String
    birth_date: String
    country: String
  }

  type Game {
    id: ID
    round: Int
    date: String
    video_id: String
    skaters: [Skater]
  }

  type Query {
    games: [Game]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Game: {
    skaters: game => game.getSkaters()
  },
  Skater: {
    full_name: skater =>
      [skater.first_name, skater.last_name].filter(Boolean).join(' ')
  },
  Query: {
    games: () => Game.findAll()
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({typeDefs, resolvers});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
