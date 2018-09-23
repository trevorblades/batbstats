export default (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
    round: DataTypes.INTEGER,
    date: DataTypes.DATE,
    video_id: DataTypes.STRING
  });

  Game.associate = models => {
    models.Game.hasMany(models.Attempt);
    models.Game.hasMany(models.Roshambo);
    models.Game.hasMany(models.Replacement);
    models.Game.belongsTo(models.Event);
    models.Game.belongsToMany(models.Skater, {through: models.Participant});
  };

  return Game;
};
