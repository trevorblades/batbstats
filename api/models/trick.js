export default (sequelize, DataTypes) => {
  const Trick = sequelize.define('trick', {
    name: DataTypes.STRING,
    switch: DataTypes.BOOLEAN,
    nollie: DataTypes.BOOLEAN,
    spin: DataTypes.INTEGER,
    flip: DataTypes.INTEGER,
    shuv: DataTypes.INTEGER
  });

  Trick.associate = models => {
    models.Trick.hasMany(models.Attempt);
  };

  return Trick;
};
