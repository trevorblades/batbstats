export default {
  Attempt: {
    trick: attempt => attempt.getTrick()
  },
  Game: {
    skaters: game => game.getSkaters(),
    attempts: game => game.getAttempts()
  },
  Skater: {
    full_name: skater =>
      [skater.first_name, skater.last_name].filter(Boolean).join(' ')
  },
  Query: {
    games: (parent, args, {db}) =>
      db.game.findAll({
        limit: 10,
        offset: args.offset
      })
  }
};
