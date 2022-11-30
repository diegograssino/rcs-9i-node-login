const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./config/database').connect();
// const corsOptions = require('./config/cors');

const PORT = process.env.PORT || 5000;

const corsOptions = require('./config/cors');
console.log(corsOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  console.log('GET request on /');
  return res.status(400).json({
    error: null,
    message: 'Service UP & RUNNING!',
  });
});

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
