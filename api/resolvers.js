export default {
  Attempt: {
    trick: attempt => attempt.getTrick()
  },
  Game: {
    event: game => game.getEvent(),
    skaters: game => game.getSkaters(),
    replacements: game => game.getReplacements(),
    roshambos: game => game.getRoshambos(),
    attempts: game => game.getAttempts({order: ['id']})
  },
  Skater: {
    full_name: skater =>
      [skater.first_name, skater.last_name].filter(Boolean).join(' '),
    games: skater => skater.getGames(),
    attempts: skater => skater.getAttempts()
  },
  Event: {
    games: event => event.getGames()
  },
  Trick: {
    attempts: trick => trick.getAttempts()
  },
  Query: {
    event: (parent, args, {db}) => db.event.findById(args.id),
    events: (parent, args, {db}) => db.event.findAll({order: ['id']}),
    game: (parent, args, {db}) => db.game.findById(args.id),
    skater: (parent, args, {db}) => db.skater.findById(args.id),
    skaters: (parent, args, {db}) => db.skater.findAll(),
    trick: (parent, args, {db}) => db.trick.findById(args.id),
    tricks: (parent, args, {db}) => db.trick.findAll()
  },
  Mutation: {
    updateTrick: async (parent, {id, ...args}, {db}) => {
      const trick = await db.trick.findById(id);
      return trick.update(args);
    }
  }
};
