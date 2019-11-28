import Sequelize from 'sequelize';
import {MOVES, STANCES, VARIATIONS} from './utils';

export const sequelize = new Sequelize(process.env.DATABASE_URL);

export const Event = sequelize.define('event', {
  name: Sequelize.STRING,
  image: Sequelize.STRING
});

export const Game = sequelize.define('game', {
  round: Sequelize.INTEGER,
  video: Sequelize.STRING
});

Game.belongsTo(Event);
Event.hasMany(Game);

const Attempt = sequelize.define('attempt', {
  successful: Sequelize.BOOLEAN,
  offense: Sequelize.BOOLEAN,
  redos: Sequelize.INTEGER
});

Attempt.belongsTo(Game);
Game.hasMany(Attempt);

export const Trick = sequelize.define('trick', {
  name: Sequelize.STRING,
  variation: Sequelize.ENUM(VARIATIONS),
  spin: Sequelize.INTEGER,
  flip: Sequelize.INTEGER,
  shuv: Sequelize.INTEGER,
  other: Sequelize.BOOLEAN
});

Attempt.belongsTo(Trick);
Trick.hasMany(Attempt);

export const Skater = sequelize.define('skater', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  stance: Sequelize.ENUM(STANCES),
  birthDate: Sequelize.DATE,
  country: Sequelize.STRING
});

Skater.hasMany(Attempt);
Attempt.belongsTo(Skater);

Skater.belongsToMany(Game, {through: 'skaterGames'});
Game.belongsToMany(Skater, {through: 'skaterGames'});

const Roshambo = sequelize.define('roshambo', {
  round: Sequelize.INTEGER,
  move: Sequelize.ENUM(MOVES)
});

Roshambo.belongsTo(Game);
Game.hasMany(Roshambo);

Roshambo.belongsTo(Skater);
Skater.hasMany(Roshambo);

const Replacement = sequelize.define('replacement');

Replacement.belongsTo(Game);
Game.hasMany(Replacement);

Replacement.belongsTo(Skater, {as: 'in'});
Replacement.belongsTo(Skater, {as: 'out'});

export const User = sequelize.define('user', {
  email: Sequelize.STRING,
  password: Sequelize.STRING
});
