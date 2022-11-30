const mongoose = require('mongoose');

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Database connection OK'))
    .catch(error => console.error(error));
};
