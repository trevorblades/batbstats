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
    updateSkater(input: UpdateSkaterInput!): Skater
    updateTrick(input: UpdateTrickInput!): Trick
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
    winner: Skater
    loserLetters: Int
    skaters: [Skater!]!
    attempts: [Attempt!]!
    roshambos: [Roshambo!]!
    replacements: [Replacement!]!
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
    async loserLetters(game, args, {db}) {
      const failures = await db('attempts')
        .count('id')
        .groupBy('skaterId')
        .where({
          offense: false,
          successful: false,
          gameId: game.id
        });

      const counts = failures.map(failure => failure.count);
      return Math.max(...counts) === 5 ? Math.min(...counts) : null;
    },
    async winner(game, args, {db}) {
      const loser = await db('attempts')
        .select('skaterId')
        .groupBy('skaterId')
        .where({
          offense: false,
          successful: false,
          gameId: game.id
        })
        .having(db.raw('count(id) = 5'))
        .first();

      return (
        loser &&
        db('skaters')
          .join('skaterGames', 'skaters.id', '=', 'skaterGames.skaterId')
          .where('skaterGames.gameId', game.id)
          .whereNot('skaterGames.skaterId', loser.skaterId)
          .first()
      );
    }
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
