export default (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
    name: DataTypes.STRING,
    image: DataTypes.STRING
  });

  Event.associate = models => {
    Event.hasMany(models.game);
  };

  return Event;
};
