import {STANCES} from '../common';

export default (sequelize, DataTypes) => {
  const Skater = sequelize.define('skater', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    stance: DataTypes.ENUM(STANCES),
    birth_date: DataTypes.DATE,
    hometown: DataTypes.STRING
  });

  Skater.associate = models => {
    models.Skater.hasMany(models.Attempt);
    models.Skater.belongsToMany(models.Game, {through: models.Participant});
  };

  return Skater;
};
