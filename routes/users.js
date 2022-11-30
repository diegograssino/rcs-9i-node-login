// Configuro el router y el schema correspondiente.
const router = require('express').Router();
const User = require('../models/user.js');
// Traigo el middleware que chequea el JWT
const tokenValidation = require('./tokenValidation');
// Configuro JWT
const jwt = require('jsonwebtoken');
// Configuro bcrypt
const bcrypt = require('bcryptjs');

router
  .post('/login', async (req, res) => {
    const { body } = req;
    console.log('POST /users/login');

    // Al no tener validaciones, simplemente chequea que el body no venga vacío, y sí es así retorna un msj de error.
    if (!body.name || !body.password) {
      return res.status(400).json({
        error: true,
        message: 'The message has EMPTY fields.',
      });
    }

    const user = await User.findOne({
      name: body.name,
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: 'The message has WRONG information.',
      });
    }

    const passwordOk = await bcrypt.compare(body.password, user.password);

    if (user && passwordOk) {
      // Creando token
      const token = jwt.sign(
        {
          name: user.name,
          role: user.role,
          id: user._id,
        },
        process.env.TOKEN_SECRET
      );

      // Guardando el token en la bbdd
      const userToAddToken = await User.findOneAndUpdate(
        { name: body.name },
        {
          name: user.name,
          password: user.password,
          role: user.role,
          mail: user.mail,
          tokens: token,
        },
        {
          useFindAndModify: false,
        }
      );

      return res.header('auth-token', token).status(200).json({
        error: null,
        message: 'Credentials are OK',
        role: user.role,
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

    // Chequeo doble de previa existencia del usuario, en la API y en el Schema con unique
    const newUserNameExist = await User.findOne({
      name: body.name,
    });
    const newUserMailExist = await User.findOne({
      mail: body.mail,
    });
    if (newUserNameExist || newUserMailExist) {
      return res.status(400).json({
        error: true,
        message: 'User or email already EXISTS',
      });
    }

    // Aplico bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    try {
      const newUser = new User({
        name: body.name,
        mail: body.mail,
        password: hashedPassword,
        role: body.role,
      });
      await newUser.save();
      newUser.password = body.password;
      res.status(200).json(newUser);
      console.log('ADD user ' + newUser.name);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: true, message: error });
    }
  })
  .put('/update', tokenValidation, async (req, res) => {
    const { body } = req;
    console.log('PUT/users/update' + body.name);

    const token = req.header('auth-token');
    const decodedToken = jwt.decode(token, { complete: true });

    // chequeo previamente si el user es el super usuario para no borrarlo nunca
    const SUPER_USER = process.env.SUPER_USER || 'admin';

    if (body.name === SUPER_USER || !decodedToken.payload.role === 'admin') {
      return res.status(400).json({
        error: true,
        message: 'Acceso DENEGADO.',
      });
    }

    try {
      const modUser = await User.findOneAndUpdate(
        body.name,
        { name: body.name, password: body.password, role: body.role, mail: body.mail },
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
    const token = req.header('auth-token');
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('DELETE/users/' + body.name);

    // chequeo previamente si el user es el super usuario para no borrarlo nunca
    const SUPER_USER = process.env.SUPER_USER || 'admin';

    if (body.name === SUPER_USER || !decodedToken.payload.role === 'admin') {
      return res.status(400).json({
        error: true,
        message: 'Acceso DENEGADO.',
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
