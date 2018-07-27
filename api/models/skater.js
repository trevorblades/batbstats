import {STANCES} from '../common';

export default (sequelize, DataTypes) => {
  const Skater = sequelize.define('skater', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    full_name: {
      type: DataTypes.VIRTUAL(DataTypes.STRING, ['first_name', 'last_name']),
      get() {
        return [this.get('first_name'), this.get('last_name')]
          .filter(Boolean)
          .join(' ');
      }
    },
    stance: DataTypes.ENUM(STANCES),
    birth_date: DataTypes.DATE,
    hometown: DataTypes.STRING
  });

  Skater.associate = models => {
    models.Skater.hasMany(models.Attempt);
    models.Skater.belongsToMany(models.Game, {through: models.Participant});
  };

  return Skater;
};
