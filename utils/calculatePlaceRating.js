const Review = require('../models/review')
const Place = require('../models/place')

async function updatePlaceRating(placeId) {
  const reviews = await Review.find({ _id: { $in: (await Place.findById(placeId)).reviews } });

  if (!reviews.length) {
    await Place.findByIdAndUpdate(placeId, { rating: 0 });
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  const roundedRating = Number(avgRating.toFixed(1))

  await Place.findByIdAndUpdate(placeId, { rating: roundedRating });
}

module.exports = { updatePlaceRating };