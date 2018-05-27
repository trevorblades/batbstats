const express = require('express');
const routes = require('./routes');
const {sequelize} = require('./models');

const app = express();
app.use('/', routes);

sequelize
  .sync()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}`)
    )
  );
