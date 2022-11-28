// Configuro el router y el schema correspondiente.
const router = require('express').Router();
const User = require('../models/user.js');
// Traigo mi middleware que valida el token
const tokenValidation = require('./tokenValidation');

// Configuro JWT
const jwt = require('jsonwebtoken');

router
  .get('/state', async (req, res) => {
    return res.status(400).json({
      error: null,
      message: 'Login service is UP',
    });
  })
  .post('/login', async (req, res) => {
    const { body } = req;
    console.log('POST /users/login');
    console.log(body.name);
    console.log(body.password);

    if (!body.name || !body.password) {
      return res.status(400).json({
        error: true,
        message: 'The message has EMPTY fields.',
      });
    }

    const user = await User.findOne({
      name: body.name,
    });

    console.log(user);

    const passwordOk = body.password === user.password;

    if (user && passwordOk) {
      const token = jwt.sign(
        {
          name: user.name,
          role: user.role,
          id: user._id,
        },
        process.env.TOKEN_SECRET
      );

      res.header('auth-token', token).status(200).json({
        error: null,
        role: user.role,
        message: 'Credentials are OK',
        data: { token },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Credentials are WRONG',
      });
    }
  })
  .post('/register', async (req, res) => {
    console.log('POST /users/register');
    const { body } = req;
    // Chequeo si el body no llega vacío para directamente devolver
    if (!body.name || !body.password || !body.mail) {
      return res.status(400).json({
        error: true,
        message: 'The message has EMPTY fields.',
      });
    }

    const newUserNameExist = await User.findOne({
      name: body.name,
    });

    const newUserMailExist = await User.findOne({
      mail: body.mail,
    });

    // Chequeo doble de previa existencia del usuario, en la API y en el Schema con unique
    if (newUserNameExist || newUserMailExist) {
      return res.status(400).json({
        error: true,
        message: 'User or email already EXISTS',
      });
    }

    try {
      const newUser = new User({
        name: body.name,
        mail: body.mail,
        password: body.password,
      });
      await newUser.save();
      res.status(200).json(newUser);
      console.log('ADD user ' + newUser.name);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: true, message: error });
    }
  })
  .put('/update', tokenValidation, async (req, res) => {
    const { body } = req;
    const token = req.header('auth-token');
    const decodedRole = jwt.decode(token, { complete: true });
    console.log(decodedRole.payload);
    console.log('PUT/users/update ' + body.name);

    // Chequeo si el body no llega vacío para directamente devolver
    if (!body.name || !body.password || !body.mail) {
      return res.status(400).json({
        error: true,
        message: 'The message has EMPTY fields.',
      });
    }

    try {
      // let decoded = jwtToken.decode(token, { complete: true });
      const modUser = await User.findOneAndUpdate(
        body.name,
        { name: body.name, mail: body.mail, password: body.password, role: body.role },
        {
          useFindAndModify: false,
        }
      );
      res.status(200).json(modUser);
      console.log('MOD user ' + modUser.name);
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })
  .delete('/delete', tokenValidation, async (req, res) => {
    const { body } = req;
    console.log('DELETE/users/' + body.name);

    // chequeo previamente si el user es el super usuario para no borrarlo nunca
    const SUPER_USER = process.env.SUPER_USER || 'admin';

    if (username === SUPER_USER) {
      return res.status(400).json({
        error: true,
        message: 'This user cannot be erased!',
      });
    }

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
