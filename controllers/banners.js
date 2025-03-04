const Banner = require("../models/banner");
const BadRequestError = require("../utils/errors/bad-request-err");
const NotFoundError = require("../utils/errors/not-found-err");
const { OK_CODE, NOT_FOUND_MESSAGE, ID_CAST_MESSAGE } = require("../utils/errors");

module.exports.createBanner = (req, res, next) => {
  const { title, subtile, paragraphs, image } = req.body;

  Banner.create({ title, subtile, paragraphs, image })
    .then(() => res.status(OK_CODE)
      .send({ data: {title, subtile, paragraphs, image} })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
    });
}

module.exports.deleteBanner = (req, res, next) => {
  const { id } = req.params;
  
  Banner.findByIdAndDelete(id)
    .then((banner) => {
      res.status(OK_CODE).send({ data: banner });
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

module.exports.getBanners = (req, res, next) => {
  Banner.find()
    .then(banners => res.status(OK_CODE).send({ data: banners }))
    .catch((err) => {
      if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
          next(err);
      }
    });
}