const express = require('express');
const {sequelize} = require('./models');

const app = express();
sequelize
  .sync()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}`)
    )
  );
