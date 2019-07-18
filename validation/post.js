const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.imageURL = !isEmpty(data.imageURL) ? data.imageURL : '';

  if (!Validator.isLength(data.imageURL, { min: 10, max: 300 })) {
    errors.imageURL = 'Not a valid image URL';
  }

  if (Validator.isEmpty(data.imageURL)) {
    errors.imageURL = 'Image URL is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};