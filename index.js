const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./config/database').connect();
const corsOptions = require('./config/cors');
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', cors(corsOptions), (req, res, next) => {
  console.log('GET on /');
  return res.status(200).json({
    error: null,
    message: 'Service UP & RUNNING!',
  });
});

const usersRoutes = require('./routes/users');
app.use('/users', cors(corsOptions), usersRoutes);

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
