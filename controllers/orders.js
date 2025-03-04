const Order = require("../models/order");
const { OK_CODE } = require("../utils/errors");

module.exports.createOrder = (req, res, next) => {
  const date = Date.now();
  // const user = req.user ? req.user._id : undefined;
  const { user, items, quantity, address, name } = req.body;

  Order.create({ user, date, items, quantity, address, name })
    .then(() => res.status(OK_CODE)
      .send({ data: { user, date, items, quantity, address, name } })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
    });
}

module.exports.updateOrderStatus = (req, res, next) => {
  const status = req.body.status;
  const changes = { status };
  const { id } = req.params;

  Order.findByIdAndUpdate(id, changes)
    .then(() => res.status(OK_CODE)
      .send({ data: { status } })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
      } else {
          next(err);
      }
    });
}

module.exports.getOrders = (req, res, next) => {
  Order.find()
    .then((orders) => res.status(OK_CODE)
      .send({ data: orders })
    )
    .catch((err) => {
      next(err);
    });
}

module.exports.getMyOrders = (req, res, next) => {
  const { _id } = req.user;

  Order.find({user: _id})
    .then((orders) => res.status(OK_CODE)
      .send({ data: orders })
    )
    .catch((err) => {
      next(err);
    });
}
