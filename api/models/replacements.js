export default sequelize => {
  const Replacement = sequelize.define('replacement');

  Replacement.associate = models => {
    models.Replacement.belongsTo(models.Game);
    models.Replacement.belongsTo(models.Skater, {as: 'in'});
    models.Replacement.belongsTo(models.Skater, {as: 'out'});
  };

  return Replacement;
};
