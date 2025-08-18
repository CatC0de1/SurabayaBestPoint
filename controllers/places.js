const fs = require('fs');

const Place = require('../models/place');
const Review = require('../models/review');

const ExpressError = require('../utils/ErrorHandler');
const { getWIBDate } = require('../utils/wibDate');
const { getPlaceStatus } = require('../utils/wibDate');

module.exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const ratingSort = req.query.rating || 'none';
  const orderSort = req.query.order || 'desc';
  const search = req.query.search || '';

  const limit = 5;
  const skip = (page - 1) * limit;

  let sortOption = {};
  
  // Sorting rating
  if (ratingSort === 'asc') sortOption.rating = 1;
  else if (ratingSort === 'desc') sortOption.rating = -1;
  
  // Sorting by createdAt (terbaru/terlama)
  if (orderSort) sortOption.createdAt = orderSort === 'asc' ? 1 : -1;

  let filter = {};
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const places = await Place.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);
    
  const total = await Place.countDocuments(filter);

  // Menambahkan status isNew pada setiap tempat
  const placeWithStatus = places.map(place => {
    const plain = place.toObject();
    plain.isNew = getPlaceStatus(plain.createdAt);
    return plain;
  })

  res.render('places/index', { 
    places: placeWithStatus,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    ratingSort,
    orderSort,
    search
  });
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
    let msg = 'A place with this title already exists';

    // Cek error duplicate key MongoDB
    if (error.code === 11000 && error.keyPattern?.title) {
      req.flash('error_msg', msg);
      return res.redirect('/places/create');
    } else {
      return next(new ExpressError(msg, 400));
    }
  }
}

module.exports.show = async (req, res, next) => {
  const orderSort = req.query.order === 'asc' ? 1 : -1;
  const ratingSort = req.query.rating ? (req.query.rating === 'asc' ? 1 : -1) : null;

  const sortOptions = {};
  if (ratingSort !== null) {
    sortOptions.rating = ratingSort;
  }
  sortOptions.createdAt = orderSort;

  const place = await Place.findOne({ title: req.params.title })
    .populate({
      path: 'reviews',
      options: {
        sort:  sortOptions
      },
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

module.exports.update = async (req, res, next) => {
  try {
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
  } catch (error) {
    let msg = 'A place with this title already exists';

    // Cek error duplicate key MongoDB
    if (error.code === 11000 && error.keyPattern?.title) {
      req.flash('error_msg', msg);
      return res.redirect('/places/create');
    } else {
      return next(new ExpressError(msg, 400));
    }
  }
}

module.exports.destroy = async (req, res, next) => {
  try {
    // const place = await Place.findOneAndDelete({ title: req.params.title });
    const { title } = req.params;
    const place = await Place.findOne({ title });

    if (place.images.length > 0) {
      place.images.forEach(image => {
        try {
          fs.unlinkSync(image.url);
        } catch (error) {
          next(new ExpressError('Failed to delete image', 500));
        }
      });
    }

    // cara manual
    // if (place.reviews.length > 0) {
    //   await Review.deleteMany({ _id: { $in: place.reviews } });
    // }
    // await place.deleteOne();

    await Place.findOneAndDelete({ title });

    req.flash('success_msg', 'Place deleted successfully!');
    res.redirect('/places');
  } catch (error) {
    next(new ExpressError('Failed to delete place', 500));
  }
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
  } catch (error) {
    req.flash('error_msg', error);
    return res.redirect(`/places/${title}/edit`);
  }
}