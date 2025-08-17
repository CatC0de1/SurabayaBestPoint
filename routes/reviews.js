const express = require('express');

// controllers
const ReviewController = require('../controllers/reviews');

// utils
const wrapAsync = require('../utils/wrapAsync');

// middlewares
const isAuth = require('../middlewares/isAuth');
const { isAuthorReview } = require('../middlewares/isAuthor');
const { validateReview } = require('../middlewares/validator');

const router = express.Router({ mergeParams: true });

router.post('/', isAuth, validateReview, wrapAsync(ReviewController.store));

router.delete('/:reviewId', isAuth, isAuthorReview, wrapAsync(ReviewController.destroy));

module.exports = router;