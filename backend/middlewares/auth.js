const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const UnauthorizedError = require('../utils/errors/unauthorizedError');

const { JWT_SECRET = config.jwtSecretKey } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }
  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new UnauthorizedError('Необходимо авторизоваться');
    return next(error);
  }

  req.user = payload;
  return next();
};
