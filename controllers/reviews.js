const Place = require('../models/place');
const Review = require('../models/review');

const { getWIBDate } = require('../utils/wibDate');
const { updatePlaceRating } = require('../utils/calculatePlaceRating');

module.exports.store = async (req, res) => {
  const review = new Review(req.body.review);
  review.author = req.user._id;
  review.createdAt = getWIBDate();

  const place = await Place.findOne({ title: req.params.title });
  place.reviews.push(review);

  await review.save();
  await place.save();

  await updatePlaceRating(place._id);
  
  req.flash('success_msg', 'Review added successfully!');
  res.redirect(`/places/${place.title}`);
}

module.exports.destroy = async (req, res) => {
  const { title, reviewId } = req.params;
 
  const place = await Place.findOneAndUpdate(
    { title },
    { $pull: { reviews: reviewId } },
    { new: true }
  );

  // await Place.findOneAndUpdate({ title }, { $pull: { reviews: reviewId } });
  // await Place.findOneAndUpdate({ title }, { $pull: { reviews: { _id: req.params.reviewId } } });
  await Review.findByIdAndDelete(reviewId);
 
  await updatePlaceRating(place._id);

  req.flash('success_msg', 'Review deleted successfully!');
  res.redirect(`/places/${title}`);
}