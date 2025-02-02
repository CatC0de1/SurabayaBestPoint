const express = require('express');

const Place = require('../models/place');

const { placeSchema } = require('../schemas/place');

// utils
const ErrorHandler = require('../utils/ErrorHandler');
const wrapAsync = require('../utils/wrapAsync');

const isValidObjectId = require('../middlewares/isValidObjectID');
const isAuth = require('../middlewares/isAuth');
const isAuthorPlace = require('../middlewares/isAuthor').isAuthorPlace;

const router = express.Router();

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    return next(new ErrorHandler(msg, 400))
  } else {
    next();
  }
}

router.get('/', wrapAsync(async (req, res) => {
  const places = await Place.find();
  res.render('places/index', { places });
}))

router.get('/create', isAuth, wrapAsync((req, res) => {
  res.render('places/create');
}))

router.post('/', isAuth, validatePlace, wrapAsync(async (req, res, next) => {
  const place = new Place(req.body.place);
  await place.save();
  req.flash('success_msg', 'Place added successfully!');
  res.redirect('/places');
}))

router.get('/:title', isValidObjectId('/places'), wrapAsync(async (req, res, next) => {
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
}))

router.get('/:title/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(async (req, res) => {
  const place = await Place.findOne({ title: req.params.title });
  res.render('places/edit', { place });
}))

router.put('/:title', isAuth, isAuthorPlace, isValidObjectId('/places'), (req, res, next) => {
  req.body = { place: req.body.place };
  next();
}, validatePlace, wrapAsync(async (req, res) => {
  const { title } = req.params;
  place = await Place.findOneAndUpdate({ title }, { ...req.body.place }, { new: true });
  req.flash('success_msg', 'Place updated successfully!');
  res.redirect(`/places/${place.title}`);
}));

router.delete('/:title', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(async (req, res) => {
  const place = await Place.findOneAndDelete({ title: req.params.title });
  req.flash('success_msg', 'Place deleted successfully!');
  res.redirect('/places');
}))

module.exports = router;