import {Game} from '../db';
import {gql} from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    games: [Game]
    game(id: ID!): Game
  }

  extend type Skater {
    games: [Game]
  }

  extend type Event {
    games: [Game]
  }

  type Game {
    id: ID
    round: Int
    date: String
    video: String
  }
`;

function games(parent) {
  return parent.getGames();
}

export const resolvers = {
  Query: {
    games() {
      return Game.findAll();
    },
    game(parent, args) {
      return Game.findByPk(args.id);
    }
  },
  Skater: {games},
  Event: {games}
};
