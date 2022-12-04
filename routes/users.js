const router = require('express').Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenValidation = require('../middlewares/tokenValidation');
const timeStamp = require('../utils/timestamp');
const {
  nameValidation,
  passValidation,
  mailValidation,
  validation,
} = require('../middlewares/validation.js');
const alreadyExistsValidation = require('../middlewares/alreadyExistsValidation');
const adminRoleValidation = require('../middlewares/adminRoleValidation');

router
  .get('/all', tokenValidation, adminRoleValidation, async (req, res, next) => {
    console.log('All users');
  })
  .post(
    '/login',
    nameValidation(),
    passValidation(),
    validation,
    async (req, res, next) => {
      const { body } = req;
      timeStamp('POST on /users/login');

      const user = await User.findOne({
        name: body.name,
      });

      if (!user) {
        return res.status(401).json({
          error: true,
          message: 'You are unauthorized to access the requested resource.',
        });
      }

      const passwordOk = await bcrypt.compare(body.password, user.password);

      if (passwordOk) {
        const token = jwt.sign(
          {
            name: user.name,
            role: user.role,
            id: user._id,
          },
          process.env.TOKEN_SECRET
        );

        return res.header('Authorization', token).status(200).json({
          error: null,
          message: 'You are authorized to access the requested resource.',
          role: user.role,
        });
      } else {
        return res.status(401).json({
          error: true,
          message: 'You are unauthorized to access the requested resource.',
        });
      }
    }
  )
  .post(
    '/register',
    nameValidation(),
    passValidation(),
    mailValidation(),
    validation,
    alreadyExistsValidation,
    async (req, res, next) => {
      timeStamp('POST /users/register');
      const { body } = req;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(body.password, salt);

      try {
        const newUser = new User({
          name: body.name,
          mail: body.mail,
          password: hashedPassword,
          role: 'admin',
        });
        await newUser.save();
        newUser.password = body.password;
        const token = jwt.sign(
          {
            name: newUser.name,
            role: newUser.role,
            id: newUser._id,
          },
          process.env.TOKEN_SECRET
        );

        return res.header('Authorization', token).status(200).json(newUser);
      } catch (error) {
        console.log(error);

        res.status(400).json({ error: true, message: error });
      }
    }
  )
  .put(
    '/update',
    tokenValidation,
    nameValidation(),
    passValidation(),
    mailValidation(),
    validation,
    async (req, res, next) => {
      const { body } = req;
      timeStamp('PUT/users/update' + body.name);
      // TODO Add middleware that checks to dont change super user

      try {
        const modUser = await User.findOneAndUpdate(
          body.name,
          {
            name: body.name,
            password: body.password,
            role: body.role,
            mail: body.mail,
          },
          {
            useFindAndModify: false,
          }
        );
        res
          .status(200)
          .json({ error: null, message: 'User update SUCCESFULL.', user: modUser });
        console.log('MOD user ' + modUser.name);
      } catch (error) {
        console.log(error);
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  )
  .delete('/delete', tokenValidation, adminRoleValidation, async (req, res, next) => {
    const { body } = req;
    // TODO Add check to dont change super user

    try {
      const delUser = await User.findOneAndDelete({
        name: body.name,
      });
      res.status(200).json(delUser);
      console.log('DEL user ' + delUser.name);
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  });

module.exports = router;
