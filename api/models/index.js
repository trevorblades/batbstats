const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const pascalcase = require('pascalcase');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    underscored: true
  }
});

const db = {};
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[pascalcase(model.name)] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
