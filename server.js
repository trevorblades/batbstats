const express = require('express');
const db = require('./models');

const app = express();
db.sequelize
  .sync()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}`)
    )
  );
