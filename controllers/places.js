const fs = require('fs');

const Place = require('../models/place');
const Review = require('../models/review');

const ExpressError = require('../utils/ErrorHandler');
const { getWIBDate } = require('../utils/wibDate');
const { getPlaceStatus } = require('../utils/wibDate');

module.exports.index = async (req, res) => {
  const places = await Place.find();

  // Menambahkan status isNew pada setiap tempat
  const placeWithStatus = places.map(place => {
    const plain = place.toObject();
    plain.isNew = getPlaceStatus(plain.createdAt);
    return plain;
  })

  res.render('places/index', { places: placeWithStatus });
}

module.exports.store = async (req, res, next) => {
  try {
    const images = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
    const place = new Place(req.body.place);
    place.author = req.user._id;
    place.images = images;
  
    place.createdAt = getWIBDate();
    place.updatedAt = getWIBDate();
  
    await place.save();
    req.flash('success_msg', 'Place added successfully!');
    res.redirect('/places');
  } catch (error) {
    // Cek error duplicate key MongoDB
    if (error.code === 11000 && error.keyPattern.title) {
      req.flash('error_msg', 'A place with this title already exists.');
      return res.redirect('/places/create');
    }

    next(error);
  }
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
    
    // logic untuk menghapus gambar lama
    // place.images.forEach(image => {
    //   fs.unlinkSync(image.url, err => new ExpressError(err, next));
    // });

    const images = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
    // place.images = images;  // logic untuk mengganti semua gambar
    place.images.push(...images); // logic untuk menambahkan gambar baru

    place.updatedAt = getWIBDate();

    await place.save();
  }

  req.flash('success_msg', 'Place updated successfully!');
  res.redirect(`/places/${place.title}/edit`);
}

module.exports.destroy = async (req, res) => {
  // const place = await Place.findOneAndDelete({ title: req.params.title });
  const { title } = req.params;
  const place = await Place.findOne({ title });
  if (place.images.length > 0) {
    place.images.forEach(image => {
      fs.unlinkSync(image.url, err => new ExpressError(err));
    });

    // pseucode untuk menghapus review ketika place dihapus
  // if (review) {
  //   await Review.deleteMany({ _id: { $in: place.reviews } });
  // }

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