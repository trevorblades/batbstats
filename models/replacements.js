export default sequelize => {
  const Replacement = sequelize.define('replacement');

  Replacement.associate = models => {
    Replacement.belongsTo(models.game);
    Replacement.belongsTo(models.skater, {as: 'in'});
    Replacement.belongsTo(models.skater, {as: 'out'});
  };

  return Replacement;
};
