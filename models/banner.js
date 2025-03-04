const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const bannerSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  paragraphs: {
    type: Array,
    types: [{
      name: { type: String },
    }],
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      }
    },
  },
});

module.exports = mongoose.model('banner', bannerSchema);
