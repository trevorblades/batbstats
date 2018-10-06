export default (sequelize, DataTypes) => {
  const Attempt = sequelize.define('attempt', {
    successful: DataTypes.BOOLEAN,
    offense: DataTypes.BOOLEAN,
    redos: DataTypes.INTEGER
  });

  Attempt.associate = models => {
    Attempt.belongsTo(models.skater);
    Attempt.belongsTo(models.trick);
    Attempt.belongsTo(models.game);
  };

  return Attempt;
};
