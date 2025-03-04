const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const commentSchema = new Schema({
  author: {
    type: ObjectId,
    required: true,
  },
  review: {
    type: ObjectId,
    required: true,
  },
  text: {
    type: String,
    maxlength: 512,
  },
});

module.exports = mongoose.model('comment', commentSchema);
