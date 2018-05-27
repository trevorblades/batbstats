module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
    round: DataTypes.INTEGER,
    date: DataTypes.DATE
  });

  Game.associate = models => {
    models.Game.hasMany(models.Attempt);
    models.Game.hasMany(models.Roshambo);
    models.Game.belongsTo(models.Event);
    models.Game.belongsToMany(models.Skater, {through: models.Participant});
  };

  return Game;
};
