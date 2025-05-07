const Review = require("../models/review");
const NotFoundError = require("../utils/errors/not-found-err");
const BadRequestError = require("../utils/errors/bad-request-err");
const { OK_CODE } = require("../utils/errors");

module.exports.getReviews = (req, res, next) => {
  Review.find()
    .then(reviews => res.status(OK_CODE).send({ data: reviews }))
    .catch((err) => {
      next(err);
    });
}


module.exports.getUserReviews = (req, res, next) => {
  const { id } = req.params;

  Review.find({ author: id })
    .then(reviews => res.status(OK_CODE).send({ data: reviews }))
    .catch((err) => next(err));
}


module.exports.getProductReviews = (req, res, next) => {
  const { id } = req.params;

  Review.find({ product: id })
    .then(reviews => res.status(OK_CODE).send({ data: reviews }))
    .catch((err) => next(err));
}


module.exports.addViewToVideo = (req, res, next) => {
  const { id } = req.params;
  const views = req.body.views;
  changes = { views: views + 1 };

  Review.findByIdAndUpdate(id, changes)
    .then(reviews => res.status(OK_CODE).send({ data: reviews }))
    .catch((err) => next(err));
}


module.exports.getReview = (req, res, next) => {
  const { id } = req.params;

  Review.findById(id)
    .orFail(() => {
      const error = new Error();
      error.name = "NotFound";
      return Promise.reject(error);
    })
    .then(review => res.status(OK_CODE).send({ data: review }))
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


module.exports.createReview = (req, res, next) => {
  const { author, product, video, text } = req.body;



  if (!product || !video || !text || !video.src || !video.oid || !video.id) {
    return next(new BadRequestError('Все обязательные поля должны быть заполнены.'));
  }

  Review.create({ author, product, video, text })
    .then(() => res.status(OK_CODE)
      .send({ data: { author, product, video, text, views: 0 } })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
}

module.exports.deleteReview = (req, res, next) => {
  const { id } = req.params;

  Review.findByIdAndDelete(id)
    .then((review) => {
      res.status(OK_CODE).send({ data: review });
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

