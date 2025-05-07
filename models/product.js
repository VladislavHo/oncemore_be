const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
  },
  photos: {
    type: Array,
    types: [{
      name: { 
        type: String,
        validate: {
          validator(value) {
            return validator.isURL(value);
          }
        }
      },
    }],
    default: [],
  },
  category: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
  },
  reviews: {
    required: false,
    type: Array
  },
  brand: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
  },
  color: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  composition: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  appliance: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32,
  },
  article: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32,
  },
  barcode: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0
  },
  likes: [{
    type: ObjectId,
    ref: 'user'
  }],
  colorImages: [{
    color: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }],
  type: {
    type: String,
    required: true,
  },
  isNew: {
    type: Boolean,
    default: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('product', productSchema);
