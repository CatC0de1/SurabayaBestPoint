const Place = require('../models/place');
const Review = require('../models/review');

module.exports.isAuthorPlace = async (req, res, next) => {
  const { title } = req.params;
  let place = await Place.findOne({ title });
  
  if (!place.author.equals(req.user._id)) {
    req.flash('error_msg', 'You are not authorized to do that!');
    return res.redirect(`/places/${place.title}`);
  }

  next();
}

module.exports.isAuthorReview = async (req, res, next) => {
  const { title, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  
  if (!review.author.equals(req.user._id)) {
    req.flash('error_msg', 'You are not authorized to do that!');
    return res.redirect(`/places/${title}`);
  }

  next();
}