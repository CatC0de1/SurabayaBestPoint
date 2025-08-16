// ./routes/account.js
const express = require('express');
const router = express.Router();

// utils
const wrapAsync = require('../utils/wrapAsync');

// middlewares
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const { isAccountOwner } = require('../middlewares/isAuthor');

// controllers
const AccountController = require('../controllers/account');


// Jika sudah login, redirect ke /account/:id, jika belum login, otomatis diarahkan ke login oleh isAuth
router.get('/', isAuth,
  wrapAsync(async (req, res) => {
    return res.redirect(`/account/${req.user._id}`);
  })
);

router.route('/:id')
  .get(wrapAsync(AccountController.show))
  .patch(isAuth, isAccountOwner, wrapAsync(AccountController.update))
  .delete(isAuth, isAccountOwner, wrapAsync(AccountController.destroy))

module.exports = router;
