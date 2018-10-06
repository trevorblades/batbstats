const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

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
    db[model.name] = model;
  });

for (const key in db) {
  if (db[key].associate) {
    db[key].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
