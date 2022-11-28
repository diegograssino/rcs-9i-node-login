const jwt = require('jsonwebtoken');

// middleware to validate token (rutas protegidas)
const tokenValidation = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ error: 'Acceso DENEGADO' });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Acceso DENEGADO' });
  }
};

module.exports = tokenValidation;
