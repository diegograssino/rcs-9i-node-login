const User = require('../models/user.js');

const alreadyExistsValidation = async (req, res, next) => {
  const { body } = req;

  const newUserNameExist = await User.findOne({
    name: body.name,
  });
  const newUserMailExist = await User.findOne({
    mail: body.mail,
  });

  if (newUserNameExist || newUserMailExist) {
    return res.status(403).json({
      error: true,
      message: 'User already exists.',
    });
  }
  next();
};

module.exports = alreadyExistsValidation;
