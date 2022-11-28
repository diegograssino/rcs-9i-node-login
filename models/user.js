// Configuro el schema de mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// min y max pone limite al largo del dato, required lo hace obligatorio y unique que no se repita nunca. A su vez, default me da la opción de tener un valor por defecto en caso de que no envien nada.
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 12,
    unique: true,
  },
  mail: {
    type: String,
    required: true,
    min: 6,
    max: 128,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 12,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('users', userSchema);

module.exports = User;
