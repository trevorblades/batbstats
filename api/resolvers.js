export default {
  Game: {
    skaters: game => game.getSkaters()
  },
  Skater: {
    full_name: skater =>
      [skater.first_name, skater.last_name].filter(Boolean).join(' ')
  },
  Query: {
    games: (parent, args, {db}) => db.game.findAll()
  }
};
