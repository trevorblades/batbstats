export default (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
    round: DataTypes.INTEGER,
    date: DataTypes.DATE,
    video_id: DataTypes.STRING
  });

  Game.associate = models => {
    Game.hasMany(models.attempt);
    Game.hasMany(models.roshambo);
    Game.hasMany(models.replacement);
    Game.belongsTo(models.event);
    Game.belongsToMany(models.skater, {through: models.participant});
  };

  return Game;
};
