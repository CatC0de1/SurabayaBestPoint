//schemas
const { reviewSchema } = require('../schemas/review');
const { placeSchema } = require('../schemas/place');
const { userSchema } = require('../schemas/user');

//utils
const ErrorHandler = require('../utils/ErrorHandler');

module.exports.validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    return next(new ErrorHandler(msg, 400))
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    return next(new ErrorHandler(msg, 400))
  } else {
    next();
  }
}

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    return next(new ErrorHandler(msg, 400))
  } else {
    next();
  }
}