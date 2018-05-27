const {ROSHAMBO_MOVES} = require('../../common');

module.exports = (sequelize, DataTypes) => {
  const Roshambo = sequelize.define('roshambo', {
    round: DataTypes.INTEGER,
    move: DataTypes.ENUM(ROSHAMBO_MOVES)
  });

  Roshambo.associate = models => {
    models.Roshambo.belongsTo(models.Skater);
    models.Roshambo.belongsTo(models.Game);
  };

  return Roshambo;
};
