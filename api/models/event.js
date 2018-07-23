export default (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
    name: DataTypes.STRING
  });

  Event.associate = models => {
    models.Event.hasMany(models.Game);
  };

  return Event;
};
