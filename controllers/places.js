const fs = require('fs');

const Place = require('../models/place');

const ExpressError = require('../utils/ErrorHandler');

module.exports.index = async (req, res) => {
  const places = await Place.find();
  res.render('places/index', { places });
}

module.exports.store = async (req, res, next) => {
  const images = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }));
  const place = new Place(req.body.place);
  place.author = req.user._id;
  place.images = images;
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
    next(new ExpressError('Page not found', 404));
  }
}

module.exports.edit = async (req, res) => {
  const place = await Place.findOne({ title: req.params.title });
  res.render('places/edit', { place });
}

module.exports.update = async (req, res) => {
  const { title } = req.params;
  const place = await Place.findOneAndUpdate({ title }, { ...req.body.place }, { new: true });
  if (req.files && req.files.length > 0) {
    place.images.forEach(image => {
      fs.unlinkSync(image.url, err => new ExpressError(err, next));
    });
    const images = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
    place.images = images;
    await place.save();
  }
  req.flash('success_msg', 'Place updated successfully!');
  res.redirect(`/places/${place.title}`);
}

module.exports.destroy = async (req, res) => {
  // const place = await Place.findOneAndDelete({ title: req.params.title });
  const { title } = req.params;
  const place = await Place.findOne({ title });
  if (place.images.length > 0) {
    place.images.forEach(image => {
      fs.unlinkSync(image.url, err => new ExpressError(err));
    });

    await place.deleteOne();
  }
  req.flash('success_msg', 'Place deleted successfully!');
  res.redirect('/places');
}

module.exports.destroyImage = async (req, res) => {
  try {
    const { title } = req.params;
    const { images } = req.body;
    if (!images || images.length === 0) {
      req.flash('error_msg', 'No image selected!');
      return res.redirect(`/places/${title}/edit`);
    }

    images.forEach(image => {
      fs.unlinkSync(image);
    });

    await Place.findOneAndUpdate({ title }, { $pull: { images: { url: { $in: images } } } });

    req.flash('success_msg', 'Image deleted successfully!');
    return res.redirect(`/places/${title}/edit`);
  } catch (err) {
    req.flash('error_msg', 'Failed to delete image!');
    return res.redirect(`/places/${title}/edit`);
  }
}