import {AuthenticationError, UserInputError, gql} from 'apollo-server';
import {Event, Game, Skater, Trick} from './db';
import {MOVES, STANCES, VARIATIONS} from './utils';

export const typeDefs = gql`
  scalar Date
  
  type Query {
    events: [Event]
    event(id: ID!): Event
    games: [Game]
    game(id: ID!): Game
    skaters: [Skater]
    skater(id: ID!): Skater
    tricks: [Trick]
    trick(id: ID!): Trick
  }

  type Mutation {
    updateSkater(
      id: ID!
      firstName: String
      lastName: String
      stance: Stance
      country: String
      birthDate: String
    ): Skater
    updateTrick(
      id: ID!
      name: String
      flip: Int
      shuv: Int
      spin: Int
      variation: Variation
      other: Boolean
    ): Trick
  }

  type Event {
    id: ID
    name: String
    image: String
    games: [Game]
  }

  type Game {
    id: ID
    round: Int
    date: String
    video: String
    event: Event
    skaters: [Skater]
    attempts: [Attempt]
    roshambos: [Roshambo]
    replacements: [Replacement]
  }

  enum Stance {
    ${STANCES.join(' ')}
  }

  type Skater {
    id: ID
    firstName: String
    lastName: String
    fullName: String
    stance: Stance
    birthDate: Date
    country: String
    games: [Game]
    attempts: [Attempt]
  }

  enum Variation {
    ${VARIATIONS.join(' ')}
  }

  type Trick {
    id: ID
    name: String
    variation: Variation
    spin: Int
    flip: Int
    shuv: Int
    other: Boolean
    attempts: [Attempt]
  }

  type Attempt {
    id: ID
    successful: Boolean
    offense: Boolean
    redos: Int
    skaterId: String
    trick: Trick
  }

  enum Move {
    ${MOVES.join(' ')}
  }

  type Roshambo {
    id: ID
    round: Int
    move: Move
    skaterId: String
  }

  type Replacement {
    id: ID
    inId: String
    outId: String
  }
`;

function games(parent) {
  return parent.getGames();
}

function attempts(parent) {
  return parent.getAttempts({order: ['id']});
}

export const resolvers = {
  Query: {
    events: () => Event.findAll({order: ['id']}),
    event: (parent, args) => Event.findByPk(args.id),
    games: () => Game.findAll(),
    game: (parent, args) => Game.findByPk(args.id),
    skaters: () => Skater.findAll(),
    skater: (parent, args) => Skater.findByPk(args.id),
    tricks: () => Trick.findAll(),
    trick: (parent, args) => Trick.findByPk(args.id)
  },
  Mutation: {
    async updateSkater(parent, {id, ...args}, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const skater = await Skater.findByPk(id);
      if (!skater) {
        throw new UserInputError('Skater not found');
      }

      return skater.update(args);
    },
    async updateTrick(parent, {id, ...args}, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const trick = await Trick.findByPk(id);
      if (!trick) {
        throw new UserInputError('Trick not found');
      }

      return trick.update(args);
    }
  },
  Event: {games},
  Game: {
    attempts,
    event: game => game.getEvent(),
    skaters: game => game.getSkaters(),
    roshambos: game => game.getRoshambos(),
    replacements: game => game.getReplacements()
  },
  Skater: {
    games,
    attempts,
    fullName({firstName, lastName}) {
      return lastName ? `${firstName} ${lastName}` : firstName;
    }
  },
  Trick: {attempts},
  Attempt: {
    trick: attempt => attempt.getTrick()
  }
};
