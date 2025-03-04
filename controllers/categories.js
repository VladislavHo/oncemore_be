const Category = require("../models/category");
const BadRequestError = require("../utils/errors/bad-request-err");
const NotFoundError = require("../utils/errors//not-found-err");
const { OK_CODE, NOT_FOUND_MESSAGE, ID_CAST_MESSAGE } = require("../utils/errors");

module.exports.createCategory = (req, res, next) => {
  const { name, link } = req.body;

  Category.create({ name, link })
    .then(() => res.status(OK_CODE)
      .send({ data: { name, link } })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
    });
}

module.exports.deleteCategory = (req, res, next) => {
  const { name } = req.body;
  
  Category.findOneAndDelete({name: name})
    .then((category) => {
      res.status(OK_CODE).send({ data: category });
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

module.exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => res.status(OK_CODE).send({ data: categories }))
    .catch((err) => {
      if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
          next(err);
      }
    });
}