import Sequelize from 'sequelize';
import {
  Attempt,
  Event,
  Game,
  Replacement,
  Roshambo,
  Skater,
  Trick,
  sequelize
} from './db.js';
import {DateResolver, DateTimeResolver} from 'graphql-scalars';
import {EXPECTED_OPTIONS_KEY} from 'dataloader-sequelize';
import {UserInputError, gql} from 'apollo-server';

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
    createGame(input: CreateGameInput!): Game!
    updateGame(id: ID, input: UpdateGameInput!): Game!
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

  input CreateGameInput {
    round: Int!
    date: Date
    eventId: String!
    skaters: [String!]!
    replacements: [ReplacementInput!]!
  }

  input ReplacementInput {
    inId: String!
    outId: String!
  }

  input UpdateGameInput {
    date: Date
    roshambos: [RoshamboInput!]!
    attempts: [AttemptInput!]!
  }

  input RoshamboInput {
    round: Int!
    move: Move!
    skaterId: String!
  }

  input AttemptInput {
    offense: Boolean!
    successful: Boolean!
    redos: Int!
    skaterId: String!
    trickId: String!
  }

  type Event {
    id: ID!
    name: String!
    games(filter: FilterInput): [Game!]!
  }

  input FilterInput {
    round: Int
  }

  type Game {
    id: ID!
    round: Int!
    video: String
    date: Date
    updatedAt: DateTime!
    result: Result
    event: Event!
    skaters: [Skater!]!
    attempts: [Attempt!]!
    roshambos: [Roshambo!]!
    replacements: [Replacement!]!
    opponent: Skater
  }

  type Result {
    lettersAgainst: Int!
    winner: Skater!
  }

  type Skater {
    id: ID!
    firstName: String!
    lastName: String
    nickname: String
    fullName: String!
    stance: Stance
    birthDate: Date
    country: String
    games: [Game!]!
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
    attempts: [Attempt!]!
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

  type Replacement {
    id: ID!
    in: Skater
    out: Skater!
  }
`;

export const resolvers = {
  Date: DateResolver,
  DateTime: DateTimeResolver,
  Query: {
    event: (_, {id}) => Event.findByPk(id),
    events: () => Event.findAll({order: ['id']}),
    skater: (_, {id}) => Skater.findByPk(id),
    skaters: () => Skater.findAll({order: ['firstName', 'lastName']}),
    trick: (_, {id}) => Trick.findByPk(id),
    tricks: () => Trick.findAll({order: ['name']}),
    game: (_, {id}) => Game.findByPk(id),
    games: () => Game.findAll()
  },
  Mutation: {
    createSkater: (_, {input}) => Skater.create(input),
    createTrick: (_, {input}) => Trick.create(input),
    async createGame(_, args) {
      const {skaters, ...input} = args.input;
      const game = await Game.create(input, {include: Replacement});
      await game.setSkaters(skaters);
      return game;
    },
    async updateGame(_, {id, input}) {
      const game = await Game.findByPk(id);

      if (!game) {
        throw new UserInputError('Game does not exist');
      }

      const roshambos = await Roshambo.bulkCreate(input.roshambos);
      await game.setRoshambos(roshambos);

      const attempts = await Attempt.bulkCreate(input.attempts);
      await game.setAttempts(attempts);

      game.changed('updatedAt', true);
      game.setDataValue('date', input.date);
      return game.save();
    }
  },
  Event: {
    games: (event, {filter}) =>
      event.getGames({
        where: filter,
        order: ['round']
      })
  },
  Game: {
    event: (game, _, {context}) =>
      game.getEvent({[EXPECTED_OPTIONS_KEY]: context}),
    skaters: (game, _, {context}) =>
      game.getSkaters({[EXPECTED_OPTIONS_KEY]: context}),
    attempts: game => game.getAttempts({order: ['id']}),
    roshambos: game => game.getRoshambos(),
    replacements: game => game.getReplacements(),
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
          lettersAgainst: winner.getDataValue('count')
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
    },
    async opponent(game) {
      if (!game.participants) {
        return null;
      }

      const [opponent] = await game.getSkaters({
        where: {
          id: {
            [Sequelize.Op.not]: game.participants.skaterId
          }
        }
      });
      return opponent;
    }
  },
  Skater: {
    fullName: ({firstName, lastName, nickname}) =>
      [firstName, nickname && `"${nickname}"`, lastName]
        .filter(Boolean)
        .join(' '),
    async games(skater) {
      const games = await skater.getGames({
        include: [Replacement]
      });
      return games.filter(
        game =>
          // filter out games where the skater got replaced
          !game.replacements.length ||
          !game.replacements.some(
            replacement => replacement.outId === skater.id
          )
      );
    }
  },
  Attempt: {
    trick: attempt => attempt.getTrick(),
    skater: (attempt, _, {context}) =>
      attempt.getSkater({[EXPECTED_OPTIONS_KEY]: context})
  },
  Trick: {
    attempts: trick => trick.getAttempts()
  },
  Roshambo: {
    skater: (roshambo, _, {context}) =>
      roshambo.getSkater({[EXPECTED_OPTIONS_KEY]: context})
  },
  Replacement: {
    in: replacement => replacement.getIn(),
    out: replacement => replacement.getOut()
  }
};
