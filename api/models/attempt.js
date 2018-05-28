module.exports = (sequelize, DataTypes) => {
  const Attempt = sequelize.define('attempt', {
    successful: DataTypes.BOOLEAN,
    offense: DataTypes.BOOLEAN,
    redos: DataTypes.INTEGER
  });

  Attempt.associate = models => {
    models.Attempt.belongsTo(models.Skater);
    models.Attempt.belongsTo(models.Trick);
    models.Attempt.belongsTo(models.Game);
  };

  return Attempt;
};
