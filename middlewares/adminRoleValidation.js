const jwt = require('jsonwebtoken');

const adminRoleValidation = (req, res, next) => {
  const token = req.header('Authorization');
  const decodedToken = jwt.decode(token, { complete: true });

  if (!decodedToken.payload.role === 'admin') {
    return res.status(403).json({
      error: true,
      message: 'Your account is not authorized to access the requested resource.',
    });
  }
};

module.exports = adminRoleValidation;
