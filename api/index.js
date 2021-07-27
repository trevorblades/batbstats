import {ApolloServer, gql} from 'apollo-server';
import {DateResolver, DateTypeDefinition} from 'graphql-scalars';
import {Event, Skater, Trick, sequelize} from './db.js';
import {makeExecutableSchema} from '@graphql-tools/schema';

const typeDefs = gql`
  type Query {
    event(id: ID!): Event
    events: [Event!]!
    skater(id: ID!): Skater
    skaters: [Skater!]!
    trick(id: ID!): Trick
    tricks: [Trick!]!
  }

  type Event {
    name: String!
    games: [Game!]!
  }

  type Game {
    round: Int!
    video: String
    date: Date
    skaters: [Skater!]!
    attempts: [Attempt!]!
    roshambos: [Roshambo!]!
  }

  type Skater {
    firstName: String
    lastName: String
    stance: Stance
    birthDate: Date
    country: String
    replacement: Skater
  }

  enum Stance {
    regular
    goofy
  }

  type Trick {
    name: String!
    variation: Variation
    spin: Int!
    flip: Int!
    shuv: Int!
    other: Boolean!
  }

  enum Variation {
    switch
    nollie
    fakie
  }

  type Attempt {
    successful: Boolean!
    offense: Boolean!
    redos: Int!
    trick: Trick!
    skater: Skater!
  }

  type Roshambo {
    round: Int!
    move: Move!
    skater: Skater!
  }

  enum Move {
    rock
    paper
    scissors
  }
`;

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [DateTypeDefinition, typeDefs],
    resolvers: {
      Date: DateResolver,
      Query: {
        event: (_, {id}) => Event.findByPk(id),
        events: () => Event.findAll(),
        skater: (_, {id}) => Skater.findByPk(id),
        skaters: () => Skater.findAll(),
        trick: (_, {id}) => Trick.findByPk(id),
        tricks: () => Trick.findAll()
      },
      Event: {
        games: event => event.getGames()
      },
      Game: {
        skaters: game => game.getSkaters(),
        attempts: game => game.getAttempts(),
        roshambos: game => game.getRoshambos()
      },
      Skater: {
        replacement: skater => skater.participant?.getReplacement()
      },
      Attempt: {
        trick: attempt => attempt.getTrick(),
        skater: attempt => attempt.getSkater()
      }
    }
  })
});

sequelize.sync().then(async () => {
  const {url} = await server.listen({port: process.env.PORT});
  console.log(`🚀 Server ready at ${url}`);
});
