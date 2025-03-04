const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const User = require('../models/user');
const { OK_CODE } = require('../utils/errors');

module.exports = (req, res, next) => {
    const user = req.user;

    if (!user) {
      next(new UnauthorizedError("Not authorized"));
    }

    const { _id } = user;

    try {
      User.findById(_id)
        .orFail(() => {
          const error = new Error();
          error.name = "NotFound";
          return Promise.reject(error);
        })
        .then((user) => {
          if (user.privilege < 1)
            throw new Error();
        })
        .catch((err) => {
          throw err;
      });
    } catch (err) {
      next(new UnauthorizedError("Not authorized"));
    }

    return next();
};
