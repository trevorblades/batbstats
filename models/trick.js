import {VARIATIONS} from '@batbstats/common';

export default (sequelize, DataTypes) => {
  const Trick = sequelize.define('trick', {
    name: DataTypes.STRING,
    variation: DataTypes.ENUM(VARIATIONS),
    spin: DataTypes.INTEGER,
    flip: DataTypes.INTEGER,
    shuv: DataTypes.INTEGER,
    other: DataTypes.BOOLEAN
  });

  Trick.associate = models => {
    Trick.hasMany(models.attempt);
  };

  return Trick;
};
