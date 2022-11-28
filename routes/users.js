// Configuro el router y el schema correspondiente.
const router = require('express').Router();
const User = require('../models/user.js');

router
  .get('/state', async (req, res) => {
    return res.status(400).json({
      error: null,
      message: 'Login service OK.',
    });
  })
  .post('/login', async (req, res) => {
    const { body } = req;
    console.log('POST /users/login');

    if (!body.name || !body.password) {
      return res.status(400).json({
        error: true,
        message: 'The message has EMPTY fields.',
      });
    }

    const user = await User.findOne({
      name: body.name,
    });

    const passwordOk = body.password === user.password;

    if (user && passwordOk) {
      return res.status(200).json({
        error: null,
        message: 'Credentials are OK',
        role: user.role || 'user',
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
  .put('/update/', async (req, res) => {
    const { body } = req;
    console.log('PUT/users/update' + username);
    try {
      const modUser = await User.findOneAndUpdate(
        body.name,
        { name: body.name, password: body.password, role: body.role },
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
  .delete('/delete/:username', async (req, res) => {
    const { username } = req.params;
    console.log('DELETE/users/' + username);

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
        name: username,
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
