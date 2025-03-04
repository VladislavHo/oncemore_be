const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const orderSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User', 
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  items: {
    type: Array,
    maxlength: 64,
    required: true,
    types: [{
      name: { type: ObjectId },
    }]
  },
  quantity: {
    type: Array,
    maxlength: 64,
    required: true,
    types: [{
      name: { type: Number },
    }]
  },
  status: {
    type: String,
    default: "В обработке",
  },
  name: {
    type: String,
    maxlength: 64,
  },
  address: {
    type: String,
    maxlength: 192,
  },
});

module.exports = mongoose.model('order', orderSchema);
