const Place = require('../models/place');

module.exports.index = async (req, res) => {
  const places = await Place.find();
  res.render('places/index', { places });
}

module.exports.store = async (req, res, next) => {
  const place = new Place(req.body.place);
  place.author = req.user._id;
  await place.save();
  req.flash('success_msg', 'Place added successfully!');
  res.redirect('/places');
}

module.exports.show = async (req, res, next) => {
  const place = await Place.findOne({ title: req.params.title })
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('author');
  // console.log(place);
  if (place) {
    res.render('places/show', { place });
  } else {
    next(new ErrorHandler('Page not found', 404));
  }
}

module.exports.edit = async (req, res) => {
  const place = await Place.findOne({ title: req.params.title });
  res.render('places/edit', { place });
}

module.exports.update = async (req, res) => {
  const { title } = req.params;
  place = await Place.findOneAndUpdate({ title }, { ...req.body.place }, { new: true });
  req.flash('success_msg', 'Place updated successfully!');
  res.redirect(`/places/${place.title}`);
}

module.exports.destroy = async (req, res) => {
  const place = await Place.findOneAndDelete({ title: req.params.title });
  req.flash('success_msg', 'Place deleted successfully!');
  res.redirect('/places');
}
