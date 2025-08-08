
const express = require('express');

// controllers
const ReviewController = require('../controllers/reviews');

// utils
const wrapAsync = require('../utils/wrapAsync');

// middlewares
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const { isAuthorReview } = require('../middlewares/isAuthor');
const { validateReview } = require('../middlewares/validator');

const router = express.Router({ mergeParams: true });

router.post('/', isAuth, validateReview, isValidObjectId('/places'), wrapAsync(ReviewController.store));

router.delete('/:reviewId', isAuth, isAuthorReview, isValidObjectId('/places'), wrapAsync(ReviewController.destroy));

module.exports = router;