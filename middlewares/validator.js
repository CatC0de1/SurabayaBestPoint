//schemas
const { reviewSchema } = require('../schemas/review');
const { placeSchema } = require('../schemas/place');
const { userSchema } = require('../schemas/user');

//utils
const ExpressError = require('../utils/ErrorHandler');

module.exports.validatePlace = (req, res, next) => {
  let messages = [];

  // const dataToValidate = {
    // place: {
      // ...req.body.place,
      // images: req.files
    // }
  // };

  // const { error } = placeSchema.validate(
    // dataToValidate
    // // { abortEarly: false }  // Jika mau error validasi nya muncul beberapa sekaligus
  // );

  const { error } = placeSchema.validate(req.body);
  
  if (error) {
    messages.push(...error.details.map(el => el.message));
  }

  if (req.duplicateError && req.duplicateError.keyPattern?.title && req.duplicateError.code === 11000) {
    messages.push('A place with this title already exists');
  }

  if (messages.length > 0) {
    const msg = messages.join(", ");

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('error_msg', msg);

      if (req.originalUrl.includes('/places/create')) {
        return res.redirect('/places/create');
      } else if (req.originalUrl.includes('/edit')) {
        return res.redirect(req.originalUrl);
      } else {
        return res.redirect('/places');
      }
    }

    return next(new ExpressError(msg, 400));
  }

  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  
  if (error) {
    const msg = error.details.map(el => el.message).join(", ")

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('error_msg', msg);
      return res.redirect(req.originalUrl);
    }
    
    return next(new ExpressError(msg, 400))
  } else {
    next();
  }
}

module.exports.validateUser = (req, res, next) => {
  let messages = [];
  const { error } = userSchema.validate(req.body);

  if (error) {
    messages.push(...error.details.map(el => el.message));
  }

  if (messages.length > 0) {
    const msg = messages.join(", ");

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('error_msg', msg);
      return res.redirect('/register')
    }

    return next(new ExpressError(msg, 400))
  } else {
    next();
  }
}

module.exports.validatePlaceImages = (req, res, next) => {
  const files = req.files || [];

  if (!files.length) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024;

  for (const file of files) {
    if (!allowedTypes.includes(file.mimetype)) {
      const msg = '"images" only accept .jpeg, .jpg, .png, or .webp format';
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        req.flash('error_msg', msg);
        return res.redirect(req.originalUrl);
      } else {
        return next(new ExpressError(msg, 400))
      }
    }
  
    if (file.size > maxSize) {
      const msg = '"images" size must be less than 5MB';
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        req.flash('error_msg', msg);
        return res.redirect(req.originalUrl);
      } else {
        return next(new ExpressError(msg, 400))
      }
    }
  }

  next();
}