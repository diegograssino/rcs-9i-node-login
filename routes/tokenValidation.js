const jwt = require('jsonwebtoken');

// middleware para validar el token

const tokenValidation = (req, res, next) => {
  // Recupero el token del header
  const token = req.header('auth-token');

  // Si no habia un token, devuelvo un error
  if (!token) return res.status(401).json({ error: true, message: 'Acceso DENEGADO' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: true, message: 'Acceso DENEGADO 2' });
  }
};

module.exports = tokenValidation;
