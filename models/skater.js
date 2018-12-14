import {STANCES} from '../common';

export default (sequelize, DataTypes) => {
  const Skater = sequelize.define('skater', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    stance: DataTypes.ENUM(STANCES),
    birth_date: DataTypes.DATE,
    country: DataTypes.STRING
  });

  Skater.associate = models => {
    Skater.hasMany(models.attempt);
    Skater.belongsToMany(models.game, {through: models.participant});
  };

  return Skater;
};
