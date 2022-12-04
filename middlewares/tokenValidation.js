const jwt = require('jsonwebtoken');

const tokenValidation = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ error: true, message: 'Access DENIED.' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: true, message: 'Acces DENIED.' });
  }
};

module.exports = tokenValidation;
