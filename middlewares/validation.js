const { body, validationResult } = require('express-validator');

// Regex ^[a-zA-Z ]*$

const nameValidation = () => {
  return [body('name').exists().isLength({ min: 4, max: 36 }).isAlphanumeric().trim()];
};

const passValidation = () => {
  return [body('password').exists().isAlphanumeric().isLength({ min: 4, max: 8 })];
};

const mailValidation = () => {
  return [body('mail').exists().isEmail()];
};

const validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

module.exports = { nameValidation, passValidation, mailValidation, validation };
