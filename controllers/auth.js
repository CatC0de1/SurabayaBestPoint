const User = require('../models/user');
const ExpressError = require('../utils/ErrorHandler');

const { getWIBDate, getWIBFormattedDate } = require('../utils/wibDate');

module.exports.registerForm = (req, res) => {
  res.render('auth/register');
}

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password, gender, birthday } = req.body;

    const createdAt = getWIBDate(); 
    // const formattedBirthday = getWIBFormattedDate(birthday);

    const user = new User({ email, username, gender, birthday, createdAt });
    const registerUser = await User.register(user, password);

    req.login(registerUser, err => {
      if (err) return next(err);
      req.flash('success_msg', 'You are registered and logged in!');
      res.redirect('/account');
    })
  } catch (error) {
    let msg;

    // cek duplikat pada passport-local-mongoose dan mongoDB
    if (error.name === 'UserExistsError' || error.code === 11000 && error.keyPattern?.title) {
      msg = 'This username already taken';
    } else if (error.code === 11000 && error.keyPattern?.email) {
      msg = 'This email already exists';
    } else if (error.message) {
      msg = error.message;
    }

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('error_msg', msg);
      return res.redirect('/register');
    } else {
      return next(new ExpressError(msg, 400));
    }
  }
}

module.exports.loginForm = (req, res) => {
  res.render('auth/login');
}

module.exports.login = (req, res) => {
  req.flash('success_msg', 'Logged in successfully!');
  res.redirect('/account');
}

module.exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    } else {
      req.flash('success_msg', 'Logged out successfully!');
      res.redirect('/');
    }
  })
}