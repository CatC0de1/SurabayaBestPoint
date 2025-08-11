const User = require('../models/user');

const { getWIBDate, getWIBFormattedDate } = require('../utils/wibDate');

module.exports.registerForm = (req, res) => {
  res.render('auth/register');
}

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password, gender, birthday, passwordConfirmation } = req.body;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      req.flash('error_msg', 'Password must be at least 6 characters long, contain letters and numbers.');
      return res.redirect('/register');
    }
    
    if (password !== passwordConfirmation) {
      req.flash('error_msg', 'Passwords do not match.');
      return res.redirect('/register');
    }

    const createdAt = getWIBDate(); 
    const formattedBirthday = getWIBFormattedDate(birthday);

    const user = new User({ email, username, gender, birthday: formattedBirthday, createdAt });
    const registerUser = await User.register(user, password);

    req.login(registerUser, err => {
      if (err) return next(err);
      req.flash('success_msg', 'You are registered and logged in!');
      res.redirect('/places');
    })
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      req.flash('error_msg', 'Email already exists.');
      return res.redirect('/register');
    } else if (error.code === 11000 && error.keyPattern.username) {
      req.flash('error_msg', 'Username already taken.');
      return res.redirect('/register');
    }

    req.flash('error_msg', error.message);
    res.redirect('/register');
  }
}

module.exports.loginForm = (req, res) => {
  res.render('auth/login');
}

module.exports.login = (req, res) => {
  req.flash('success_msg', 'Logged in successfully!');
  res.redirect('/places');
}

module.exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    } else {
      req.flash('success_msg', 'Logged out successfully!');
      res.redirect('/places');
    }
  })
}