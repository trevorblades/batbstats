import {ROSHAMBO_MOVES} from '@batbstats/common';

export default (sequelize, DataTypes) => {
  const Roshambo = sequelize.define('roshambo', {
    round: DataTypes.INTEGER,
    move: DataTypes.ENUM(ROSHAMBO_MOVES)
  });

  Roshambo.associate = models => {
    Roshambo.belongsTo(models.skater);
    Roshambo.belongsTo(models.game);
  };

  return Roshambo;
};
