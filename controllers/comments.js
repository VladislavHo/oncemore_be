const Comment = require("../models/comment");
const BadRequestError = require("../utils/errors/bad-request-err");
const NotFoundError = require("../utils/errors//not-found-err");
const { OK_CODE, NOT_FOUND_MESSAGE, ID_CAST_MESSAGE } = require("../utils/errors");

module.exports.createComment = (req, res, next) => {
  const { text, review, author } = req.body;

  Comment.create({ author, review, text })
    .then(() => res.status(OK_CODE)
      .send({ data: { author, review, text } })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
    });
}

module.exports.deleteComment = (req, res, next) => {
  const { id } = req.params;
  
  Comment.findByIdAndDelete(id)
    .then((comment) => {
      res.status(OK_CODE).send({ data: comment });
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

module.exports.getComments = (req, res, next) => {
  const { reviewId } = req.params;

  Comment.find({ review: reviewId })
    .then(comments => res.status(OK_CODE).send({ data: comments }))
    .catch((err) => {
      if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
          next(err);
      }
    });
}