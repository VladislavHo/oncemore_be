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


module.exports.createUser = (req, res, next) => {
  const { name, email, password, handle, phone } = req.body; // Включите телефон
  
  // Проверка на существующую электронную почту
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError('Электронная почта уже существует'));
      }
      
      return bcrypt.hash(password, 5);
    })
    .then((hash) => User.create({ 
      name, 
      email, 
      password: hash, 
      handle,
      phone // Добавьте телефон в создание
    }))
    .then(() => res.status(OK_CODE).send({ data: { name, email } }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(err.message);
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError(CONFLICT_MESSAGE));
      } else {
        next(err);
      }
    });
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
  console.log(changes.avatar);
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
  console.log(_id, 'id')
  User.findByIdAndUpdate(_id, changes, { new: true }) // Добавлено { new: true } для возврата обновленного документа
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(NOT_FOUND_MESSAGE)); // Проверка на случай, если пользователь не найден
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
          res.status(OK_CODE).send({ data: { name, email} });
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