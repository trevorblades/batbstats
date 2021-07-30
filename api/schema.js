import Sequelize from 'sequelize';
import {Attempt, Event, Game, Skater, Trick, sequelize} from './db.js';
import {DateResolver} from 'graphql-scalars';
import {EXPECTED_OPTIONS_KEY} from 'dataloader-sequelize';
import {gql} from 'apollo-server';

export const typeDefs = gql`
  type Query {
    event(id: ID!): Event
    events: [Event!]!
    skater(id: ID!): Skater
    skaters: [Skater!]!
    trick(id: ID!): Trick
    tricks: [Trick!]!
    game(id: ID!): Game
    games: [Game!]!
  }

  type Mutation {
    createSkater(input: SkaterInput!): Skater!
    createTrick(input: TrickInput!): Trick!
  }

  input SkaterInput {
    firstName: String!
    lastName: String
    birthDate: Date
    country: String
    stance: Stance
  }

  input TrickInput {
    name: String!
  }

  type Event {
    id: ID!
    name: String!
    games: [Game!]!
  }

  type Game {
    id: ID!
    round: Int!
    video: String
    date: Date
    result: Result
    event: Event!
    skaters: [Skater!]!
    attempts: [Attempt!]!
    roshambos: [Roshambo!]!
  }

  type Result {
    lettersAgainst: Int!
    winner: Skater!
  }

  type Skater {
    id: ID!
    firstName: String!
    lastName: String
    fullName: String!
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
    id: ID!
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
    id: ID!
    successful: Boolean!
    offense: Boolean!
    redos: Int!
    trick: Trick!
    skater: Skater!
  }

  type Roshambo {
    id: ID!
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

export const resolvers = {
  Date: DateResolver,
  Query: {
    event: (_, {id}) => Event.findByPk(id),
    events: () => Event.findAll(),
    skater: (_, {id}) => Skater.findByPk(id),
    skaters: () => Skater.findAll(),
    trick: (_, {id}) => Trick.findByPk(id),
    tricks: () => Trick.findAll(),
    game: (_, {id}) => Game.findByPk(id),
    games: () => Game.findAll()
  },
  Mutation: {
    createSkater: (_, {input}) => Skater.create(input),
    createTrick: (_, {input}) => Trick.create(input)
  },
  Event: {
    games: event => event.getGames()
  },
  Game: {
    event: (game, _, {context}) =>
      game.getEvent({[EXPECTED_OPTIONS_KEY]: context}),
    skaters: (game, _, {context}) =>
      game.getSkaters({[EXPECTED_OPTIONS_KEY]: context}),
    attempts: game => game.getAttempts({order: ['id']}),
    roshambos: game => game.getRoshambos(),
    async result(game, _, {context}) {
      const [loser, winner] = await Attempt.findAll({
        attributes: [
          'skaterId',
          [sequelize.fn('count', sequelize.col('id')), 'count']
        ],
        where: {
          offense: false,
          successful: false,
          gameId: game.id
        },
        group: ['skaterId', 'gameId'],
        order: [['count', 'desc']]
      });

      if (!loser) {
        return null;
      }

      if (winner) {
        return {
          winner: await winner.getSkater({[EXPECTED_OPTIONS_KEY]: context}),
          lettersAgainst: loser.count
        };
      }

      const [skater] = await game.getSkaters({
        where: {
          id: {
            [Sequelize.Op.not]: loser.skaterId
          }
        }
      });

      return {
        winner: skater,
        lettersAgainst: 0
      };
    }
  },
  Skater: {
    fullName: ({firstName, lastName}) =>
      [firstName, lastName].filter(Boolean).join(' '),
    replacement: skater => skater.participant?.getReplacement()
  },
  Attempt: {
    trick: attempt => attempt.getTrick(),
    skater: (attempt, _, {context}) =>
      attempt.getSkater({[EXPECTED_OPTIONS_KEY]: context})
  },
  Roshambo: {
    skater: (roshambo, _, {context}) =>
      roshambo.getSkater({[EXPECTED_OPTIONS_KEY]: context})
  }
};
