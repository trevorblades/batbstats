export default {
  Attempt: {
    trick: attempt => attempt.getTrick()
  },
  Game: {
    skaters: game => game.getSkaters(),
    replacements: game => game.getReplacements(),
    roshambos: game => game.getRoshambos(),
    attempts: game => game.getAttempts()
  },
  Skater: {
    full_name: skater =>
      [skater.first_name, skater.last_name].filter(Boolean).join(' ')
  },
  Event: {
    games: event => event.getGames()
  },
  Query: {
    events: (parent, args, {db}) => db.event.findAll({order: ['id']}),
    games: (parent, args, {db}) =>
      db.game.findAll({
        limit: 10,
        offset: args.offset
      })
  }
};
