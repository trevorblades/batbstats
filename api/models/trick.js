import {VARIATIONS} from '../../client/src/constants';

export default (sequelize, DataTypes) => {
  const Trick = sequelize.define('trick', {
    name: DataTypes.STRING,
    variation: DataTypes.ENUM(VARIATIONS),
    spin: DataTypes.INTEGER,
    flip: DataTypes.INTEGER,
    shuv: DataTypes.INTEGER
  });

  Trick.associate = models => {
    models.Trick.hasMany(models.Attempt);
  };

  return Trick;
};
