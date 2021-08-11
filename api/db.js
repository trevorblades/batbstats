import {Sequelize} from 'sequelize';

const {DataTypes, Model} = Sequelize;

export const sequelize = new Sequelize(process.env.DATABASE_URL);

const STANCE_ENUM = DataTypes.ENUM('regular', 'goofy');

export class Skater extends Model {}
Skater.init(
  {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    nickname: DataTypes.STRING,
    stance: STANCE_ENUM,
    birthDate: DataTypes.DATE,
    country: DataTypes.STRING
  },
  {
    sequelize,
    modelName: 'skater'
  }
);

const VARIATION_ENUM = DataTypes.ENUM('switch', 'nollie', 'fakie');

export class Trick extends Model {}
Trick.init(
  {
    name: DataTypes.STRING,
    variation: VARIATION_ENUM,
    spin: DataTypes.INTEGER,
    flip: DataTypes.INTEGER,
    shuv: DataTypes.INTEGER,
    other: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: 'trick'
  }
);

export class Event extends Model {}
Event.init(
  {
    // image: DataTypes.STRING,
    name: DataTypes.STRING
  },
  {
    sequelize,
    modelName: 'event'
  }
);

export class Game extends Model {}
Game.init(
  {
    round: DataTypes.INTEGER,
    video: DataTypes.STRING,
    date: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'game'
  }
);

Game.belongsTo(Event);
Event.hasMany(Game);

Game.belongsToMany(Skater, {through: 'participants'});
Skater.belongsToMany(Game, {through: 'participants'});

class Replacement extends Model {}
Replacement.init(
  {},
  {
    sequelize,
    modelName: 'replacement'
  }
);

Replacement.belongsTo(Game);
Game.hasMany(Replacement);

Replacement.belongsTo(Skater, {as: 'in'});
Replacement.belongsTo(Skater, {as: 'out'});

const MOVE_ENUM = DataTypes.ENUM('rock', 'paper', 'scissors');

export class Roshambo extends Model {}
Roshambo.init(
  {
    round: DataTypes.INTEGER,
    move: MOVE_ENUM
  },
  {
    sequelize,
    modelName: 'roshambo'
  }
);

Roshambo.belongsTo(Game);
Game.hasMany(Roshambo);

Roshambo.belongsTo(Skater);
Skater.hasMany(Roshambo);

export class Attempt extends Model {}
Attempt.init(
  {
    successful: DataTypes.BOOLEAN,
    offense: DataTypes.BOOLEAN,
    redos: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'attempt'
  }
);

Attempt.belongsTo(Game);
Game.hasMany(Attempt);

Attempt.belongsTo(Skater);
Skater.hasMany(Attempt);

Attempt.belongsTo(Trick);
Trick.hasMany(Attempt);
