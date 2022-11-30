const mongoose = require('mongoose');
const timeStamp = require('../utils/timestamp');

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => timeStamp('Database connection OK'))
    .catch(error => console.error(error));
};
