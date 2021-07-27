const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {AuthenticationError, UserInputError, gql} = require('apollo-server');

exports.typeDefs = gql`
  scalar Date

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    games: [Game!]!
    game(id: ID!): Game
    skaters: [Skater!]!
    skater(id: ID!): Skater
    tricks: [Trick!]!
    trick(id: ID!): Trick
  }

  type Mutation {
    login(input: LoginInput!): String
    updateGame(input: UpdateGameInput!): Game
    updateSkater(input: UpdateSkaterInput!): Skater
    updateTrick(input: UpdateTrickInput!): Trick
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateGameInput {
    id: ID!
    date: Date
  }

  input UpdateSkaterInput {
    id: ID!
    firstName: String!
    lastName: String!
    stance: Stance
    country: String
    birthDate: String
  }

  input UpdateTrickInput {
    id: ID!
    name: String!
    flip: Int!
    shuv: Int!
    spin: Int!
    variation: Variation
    other: Boolean!
  }

  type Event {
    id: ID!
    name: String!
    image: String
    games: [Game!]!
  }

  type Game {
    id: ID!
    round: Int!
    date: Date
    video: String!
    event: Event!
    result: Result
    skaters: [Skater!]!
    attempts: [Attempt!]!
    roshambos: [Roshambo!]!
    replacements: [Replacement!]!
  }

  type Result {
    lettersAgainst: Int!
    winner: Skater!
  }

  type Skater {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    stance: Stance
    birthDate: Date
    country: String
    games: [Game!]!
    attempts: [Attempt!]!
  }

  enum Stance {
    goofy
    regular
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
    skater: Skater!
    trick: Trick!
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
    out: Skater
  }
`;

exports.resolvers = {
  Query: {
    events: (parent, args, {db}) => db('events').orderBy('id'),
    event: (parent, {id}, {db}) =>
      db('events')
        .where({id})
        .first(),
    games: (parent, args, {db}) => db('games'),
    game: (parent, {id}, {db}) =>
      db('games')
        .where({id})
        .first(),
    skaters: (parent, args, {db}) => db('skaters'),
    skater: (parent, {id}, {db}) =>
      db('skaters')
        .where({id})
        .first(),
    tricks: (parent, args, {db}) => db('tricks'),
    trick: (parent, {id}, {db}) =>
      db('tricks')
        .where({id})
        .first()
  },
  Mutation: {
    async login(parent, {input}, {db}) {
      const user = await db('users')
        .where('email', 'ilike', input.email)
        .first();
      if (user) {
        const isValid = await bcrypt.compare(input.password, user.password);
        if (isValid) {
          return jwt.sign({email: user.email}, process.env.JWT_SECRET, {
            subject: user.id.toString()
          });
        }
      }

      throw new AuthenticationError('Invalid email/password combination');
    },
    async updateGame(parent, args, {user, db}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const {id, ...input} = args.input;
      const query = db('games').where({id});
      const game = await query.first();

      if (!game) {
        throw new UserInputError('Game does not exist');
      }

      const updated = await query.update(input).returning('*');
      return updated[0];
    },
    async updateSkater(parent, args, {user, db}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const {id, ...input} = args.input;
      const skater = await db('skaters')
        .where({id})
        .first();

      if (!skater) {
        throw new UserInputError('Skater does not exist');
      }

      const updated = await db('skaters')
        .where('id', skater.id)
        .update(input)
        .returning('*');
      return updated[0];
    },
    async updateTrick(parent, args, {user, db}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const {id, ...input} = args.input;
      const trick = await db('tricks')
        .where({id})
        .first();

      if (!trick) {
        throw new UserInputError('Trick does not exist');
      }

      const updated = await db('tricks')
        .where('id', trick.id)
        .update(input)
        .returning('*');
      return updated[0];
    }
  },
  Event: {
    games: (event, args, {db}) => db('games').where('eventId', event.id)
  },
  Game: {
    attempts: (game, args, {db}) =>
      db('attempts')
        .where('gameId', game.id)
        .orderBy('id'),
    event: (game, args, {db}) =>
      db('events')
        .where('id', game.eventId)
        .first(),
    skaters: (game, args, {db}) =>
      db('skaters')
        .join('skaterGames', 'skaters.id', '=', 'skaterGames.skaterId')
        .where('skaterGames.gameId', game.id),
    roshambos: (game, args, {db}) =>
      db('roshambos')
        .where('gameId', game.id)
        .orderBy('round'),
    replacements: (game, args, {db}) =>
      db('replacements').where('gameId', game.id),
    async result(game, args, {db}) {
      const results = await db('attempts')
        .count('id')
        .select('skaterId', 'gameId')
        .groupBy('skaterId', 'gameId')
        .where({
          offense: false,
          successful: false,
          gameId: game.id
        })
        .orderBy('count', 'desc');
      return results.length ? results : null;
    }
  },
  Result: {
    winner: ([loser, winner], args, {db}) =>
      winner
        ? db('skaters')
            .where('id', winner.skaterId)
            .first()
        : db('skaters')
            .join('skaterGames', 'skaters.id', '=', 'skaterGames.skaterId')
            .where('skaterGames.gameId', loser.gameId)
            .whereNot('id', loser.skaterId)
            .first(),
    lettersAgainst: result => (result.length === 2 ? result[1].count : 0)
  },
  Skater: {
    games: (skater, args, {db}) =>
      db('games')
        .join('skaterGames', 'games.id', '=', 'skaterGames.gameId')
        .where('skaterGames.skaterId', skater.id),
    attempts: (skater, args, {db}) =>
      db('attempts')
        .where('skaterId', skater.id)
        .orderBy('id'),
    fullName: ({firstName, lastName}) =>
      [firstName, lastName].filter(Boolean).join(' ')
  },
  Trick: {
    attempts: (trick, args, {db}) =>
      db('attempts')
        .where('trickId', trick.id)
        .orderBy('id')
  },
  Attempt: {
    skater: (attempt, args, {db}) =>
      db('skaters')
        .where('id', attempt.skaterId)
        .first(),
    trick: (attempt, args, {db}) =>
      db('tricks')
        .where('id', attempt.trickId)
        .first()
  },
  Roshambo: {
    skater: (roshambo, args, {db}) =>
      db('skaters')
        .where('id', roshambo.skaterId)
        .first()
  },
  Replacement: {
    in: (replacement, args, {db}) =>
      db('skaters')
        .where('id', replacement.inId)
        .first(),
    out: (replacement, args, {db}) =>
      db('skaters')
        .where('id', replacement.outId)
        .first()
  }
};
