const express = require('express');

// controllers
const PlaceController = require('../controllers/places');

// utils
const wrapAsync = require('../utils/wrapAsync');

// middlewares
const isValidObjectId = require('../middlewares/isValidObjectID');
const isAuth = require('../middlewares/isAuth');
const { isAuthorPlace } = require('../middlewares/isAuthor');
const { validatePlace } = require('../middlewares/validator');

// config
const upload = require('../config/multer');

const router = express.Router();

router.route('/')
  .get(wrapAsync(PlaceController.index))
  .post(isAuth, upload.array('image', 5), validatePlace, wrapAsync(PlaceController.store));
  // .post(isAuth, upload.array('image', 5), (req, res) => {
  //   console.log(req.files);
  //   console.log(req.body);
  //   res.send('Uploaded!');
  // });

router.get('/create', isAuth, wrapAsync((req, res) => {
  res.render('places/create');
}))

router.route('/:title')
  .get(isValidObjectId('/places'), wrapAsync(PlaceController.show))
  .put(isAuth, isAuthorPlace, isValidObjectId('/places'), (req, res, next) => {
    req.body = { place: req.body.place };
    next();
  }, upload.array('image', 5), validatePlace, wrapAsync(PlaceController.update))
  .delete(isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.destroy));

router.get('/:title/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.edit));

router.delete('/:title/images', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.destroyImage));

module.exports = router;