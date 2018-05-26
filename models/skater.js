module.exports = (sequelize, DataTypes) => {
  const Skater = sequelize.define('skater', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    stance: DataTypes.ENUM(['goofy', 'regular']) // eslint-disable-line new-cap
  });

  Skater.associate = models => {
    models.Skater.hasMany(models.Attempt);
    models.Skater.belongsToMany(models.Game, {through: models.Participant});
  };

  return Skater;
};
