const express = require('express');
const passport = require('passport');
const router = express.Router();

// controllers
const AuthController = require('../controllers/auth');

// utils
const wrapAsync = require('../utils/wrapAsync');

// Middleware
const recaptcha = require('../middlewares/recaptcha');

router.route('/register')
  .get(AuthController.registerForm)
  .post(wrapAsync(AuthController.register));

router.route('/login')
  .get(AuthController.loginForm)
  .post(
    // recaptcha,
    passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: {
      type: 'error_msg',
      msg: 'Invalid username or password'
    },
  }), AuthController.login);

router.post('/logout', AuthController.logout);

module.exports = router;