
const express = require('express');

const Place = require('../models/place');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas/review');

// utils
const ErrorHandler = require('../utils/ErrorHandler');
const wrapAsync = require('../utils/wrapAsync');

const isValidObjectId = require('../middlewares/isValidObjectID');
const isAuth = require('../middlewares/isAuth');

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    return next(new ErrorHandler(msg, 400))
  } else {
    next();
  }
}

router.post('/', isAuth, validateReview, isValidObjectId('/places'), wrapAsync(async (req, res) => {
  const review = new Review(req.body.review);
  const place = await Place.findOne({ title: req.params.title });
  place.reviews.push(review);
  await review.save();
  await place.save();
  req.flash('success_msg', 'Review added successfully!');
  res.redirect(`/places/${place.title}`);
}))

router.delete('/:reviewId', isAuth, isValidObjectId('/places'), wrapAsync(async (req, res) => {
  const { title, reviewId } = req.params;
  await Place.findOneAndUpdate({ title }, { $pull: { reviews: reviewId } });
  // await Place.findOneAndUpdate({ title }, { $pull: { reviews: { _id: req.params.reviewId } } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success_msg', 'Review deleted successfully!');
  res.redirect(`/places/${title}`);
}))

module.exports = router;