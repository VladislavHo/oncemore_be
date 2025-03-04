const { celebrate, Joi } = require('celebrate');
const validator = require('validator');


const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.notemail');
}


module.exports.validateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.notemail": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().min(6).messages({
      "string.empty": 'The "password" field must be filled in',
      "string.min": 'The minimum length of the "password" field is 6',
    }),
    handle: Joi.string().required().pattern(/^@/).min(2).max(32).messages({
      "string.pattern.base": 'The "handle" must start with @',
      "string.min": 'The minimum length of the "handle" field is 2',
      "string.max": 'The maximum length of the "handle" field is 32',
      "string.empty": 'The "handle" field must be filled in',
    }),
    phone: Joi.string().pattern(/^\+7[0-9]{10}$/).required().messages({
      "string.pattern.base": 'Phone number must be in format +7XXXXXXXXXX',
      "string.empty": 'The "phone" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).optional().messages({
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.notemail": 'the "email" field must be a valid email',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateReview = celebrate({
  body: Joi.object().keys({
    video: Joi.string().custom(validateURL).messages({
      "string.uri": 'the "video" field must be a valid url',
      "string.empty": 'The "video" field must be filled in',
    }),
  }),
});