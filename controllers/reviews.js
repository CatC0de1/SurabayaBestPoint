const Place = require('../models/place');
const Review = require('../models/review');

const WIBDate = require('../utils/wibDate');

module.exports.store = async (req, res) => {
  const review = new Review(req.body.review);
  review.author = req.user._id;
  review.createdAt = WIBDate();

  const place = await Place.findOne({ title: req.params.title });
  place.reviews.push(review);

  await review.save();
  await place.save();
  
  req.flash('success_msg', 'Review added successfully!');
  res.redirect(`/places/${place.title}`);
}

module.exports.destroy = async (req, res) => {
  const { title, reviewId } = req.params;
 
  await Place.findOneAndUpdate({ title }, { $pull: { reviews: reviewId } });
  // await Place.findOneAndUpdate({ title }, { $pull: { reviews: { _id: req.params.reviewId } } });
  await Review.findByIdAndDelete(reviewId);
 
  req.flash('success_msg', 'Review deleted successfully!');
  res.redirect(`/places/${title}`);
}