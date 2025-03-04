const Product = require("../models/product");
const { OK_CODE, NOT_FOUND_MESSAGE, ID_CAST_MESSAGE } = require("../utils/errors");
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');


module.exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => res.status(OK_CODE).send({ data: products }))
    .catch((err) => next(err));
}


module.exports.getProduct = (req, res, next) => {
  const { id } = req.params;

  Product.findById(id)
    .orFail(() => {
      const error = new Error();
      error.name = "NotFound";
      return Promise.reject(error);
    })
    .then(product => res.status(OK_CODE).send({ data: product }))
    .catch((err) => {
      if (err.name === 'NotFound') {
          next(NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
          next(err);
      }
    });
}

module.exports.createProduct = (req, res, next) => {
  const { name, photo, category, brand, color, price, description,
    composition, appliance, country, article, size, barcode, 
    colorImage, type, stock
  } = req.body;

  if (article && !/^[A-Z0-9]+$/.test(article)) {
    throw new BadRequestError('Article must contain only letters and numbers');
  }
  
  const productData = { 
    name, photos: [photo], category, brand, color, price, description,
    composition, appliance, country, article: article.toUpperCase(), size, barcode, type, colorImage, stock
  };

  Product.create(productData)
    .then(() => res.status(OK_CODE)
      .send({ data: productData })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
          console.log(err);
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
    });
}


module.exports.likeProduct = (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  Product.findByIdAndUpdate(id, { $push: { likes: _id } })
    .then((product) => {
      res.status(OK_CODE).send({ data: product });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
          next(NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
          next(err);
      }
  });
}


module.exports.unlikeProduct = (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  Product.findByIdAndUpdate(id, { $pull: { likes: _id } })
    .then((product) => {
      res.status(OK_CODE).send({ data: product });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
          next(NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE))
      } else {
          next(err);
      }
  });
}


module.exports.deleteProduct = (req, res, next) => {
  const { id } = req.params;
  
  Product.findByIdAndDelete(id)
    .then((product) => {
      res.status(OK_CODE).send({ data: product });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
          next(NotFoundError(NOT_FOUND_MESSAGE));
      } else if (err.name === 'CastError') {
          next(new BadRequestError(ID_CAST_MESSAGE))
      } else if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
  });
}


module.exports.editProduct = (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;
  
  Product.findByIdAndUpdate(id, changes)
      .then((product) => {
          res.status(OK_CODE).send({ data: product });
      })
      .catch((err) => {
          if (err.name === 'NotFound') {
              next(NotFoundError(NOT_FOUND_MESSAGE));
          } else if (err.name === 'CastError') {
              next(new BadRequestError(ID_CAST_MESSAGE))
          } else if (err.name === 'ValidationError') {
              next(new BadRequestError(err.message));
          } else {
              next(err);
          }
  });
}

module.exports.addPhotoToProduct = (req, res, next) => {
  const { id } = req.params;
  const photo = req.body.photo;
  
  Product.findByIdAndUpdate(id, {$push: {photos: photo}})
      .then((product) => {
          res.status(OK_CODE).send({ data: product });
      })
      .catch((err) => {
          if (err.name === 'NotFound') {
              next(NotFoundError(NOT_FOUND_MESSAGE));
          } else if (err.name === 'CastError') {
              next(new BadRequestError(ID_CAST_MESSAGE))
          } else if (err.name === 'ValidationError') {
              next(new BadRequestError(err.message));
          } else {
              next(err);
          }
  });
}