const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  OK_CODE,
  NOT_FOUND_MESSAGE,
  ID_CAST_MESSAGE,
  CONFLICT_MESSAGE,
} = require('../utils/errors')
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const ConflictError = require('../utils/errors/conflict-err');


module.exports.createUser = async (req, res, next) => {
  const { name, email, password, handle, phone } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      if (existingUser.phone === phone) {
        throw new ConflictError('Пользователь с таким номером телефона уже существует');
      }
    }

    const hash = await bcrypt.hash(password, 5);
    const user = await User.create({ name, email, phone, password: hash, handle });
    res.status(201).send({ data: { name: user.name, email: user.email } });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные: ' + err.message));
    } else if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email или номером телефона уже существует'));
    } else {

      next(err);
    }
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      const error = new Error();
      error.name = "NotFound";
      return Promise.reject(error);
    })
    .then(user => res.status(OK_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
        next(err);
      }
    });
}

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      const error = new Error();
      error.name = "NotFound";
      return Promise.reject(error);
    })
    .then(user => res.status(OK_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
        next(err);
      }
    });
}

module.exports.editCurrentUser = (req, res, next) => {
  const changes = {};
  //changes.name ??= req.body.name;
  changes.avatar = req.body.avatar;

  const { _id } = req.user;

  User.findByIdAndUpdate(_id, changes)
    .then((user) => {
      res.status(OK_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(ID_CAST_MESSAGE))
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
}

module.exports.changeUserPoints = (req, res, next) => {
  const changes = {};
  changes.points = req.body.points;
  const _id = req.params.id;

  User.findByIdAndUpdate(_id, changes, { new: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(NOT_FOUND_MESSAGE));
      }
      res.status(OK_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ID_CAST_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
}

module.exports.blockUser = (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndUpdate(_id, { privilege: -1, })
    .then((user) => {
      const { name, email } = user;
      res.status(OK_CODE).send({ data: { name, email } });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(ID_CAST_MESSAGE))
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
}