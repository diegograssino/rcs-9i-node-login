const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./config/database').connect();
const timeStamp = require('./utils/timestamp');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res, next) => {
  timeStamp('GET on /');
  return res.status(200).json({
    error: null,
    message: 'Service UP & RUNNING!',
  });
});

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

app.listen(PORT, () => {
  timeStamp('Server running on port ' + PORT);
});
