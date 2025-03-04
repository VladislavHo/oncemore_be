const mongoose = require('mongoose');
const validator = require('validator');

// Определение схемы и модели
const { Schema } = mongoose;

// Валидатор для URL
const urlValidator = value => {
  return validator.isURL(value);
};

const reviewSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  video: {
    src: {
      type: String,
      validate: urlValidator,
      required: true,
    },
    oid: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  text: {
    type: String,
    maxlength: 512,
    required: false,
    default: ""
  },
  views: {
    type: Number,
    default: 0,
    required: false,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
