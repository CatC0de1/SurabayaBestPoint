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

// config
const upload = require('../config/multer');


// Jika sudah login, redirect ke /account/:id, jika belum login, otomatis diarahkan ke login oleh isAuth
router.get('/', isAuth,
  wrapAsync(async (req, res) => {
    return res.redirect(`/account/${req.user._id}`);
  })
);

router.route('/:id')
  .get(isValidObjectId('/account'), wrapAsync(AccountController.show))
  .delete(isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.destroy))

router.patch('/:id/username', isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.updateUsername));
router.patch('/:id/email', isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.updateEmail));
router.patch('/:id/profil', isAuth, isAccountOwner, isValidObjectId('/account'), upload('profiles').array('image', 1), wrapAsync(AccountController.updateProfil));
router.patch('/:id/fullname', isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.updateFullname));
router.patch('/:id/description', isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.updateDescription));
router.patch('/:id/contact', isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.updateContact));
router.patch('/:id/password', isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.updatePassword));

router.delete('/:id/profil', isAuth, isAccountOwner, isValidObjectId('/account'), wrapAsync(AccountController.destroyImage));

module.exports = router;
