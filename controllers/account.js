const User = require('../models/user');
const ExpressError = require('../utils/ErrorHandler');


module.exports.show = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) next(new ExpressError('User not found!', 404));
  
  res.render('account/show', { user });
};

module.exports.updateUsername = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
  
    // validasi username
    const usernamePattern = /^[a-z0-9_]+$/;
    if (!username || username.length < 3 || !usernamePattern.test(username)) {
      req.flash('error_msg', '"username" at least 3 characters long and only contain lowercases, numbers, and underscores');
      return res.redirect(`/account/${id}`);
    }
  
    const user = await User.findByIdAndUpdate( id, { username }, { new: true, runValidators: true });
    if (!user) next(new ExpressError('User not found!', 404));
    
    req.login(user, (error) => {
      if (error) return next(error);
      req.flash('success_msg', 'Update username succesfully!');
      res.redirect(`/account/${id}`);
    })
  } catch (error) {
    let msg;

    // cek duplikat pada passport-local-mongoose dan mongoDB
    if (error.name === 'UserExistsError' || error.code === 11000 && error.keyPattern?.username) {
      msg = 'This username already taken!';
    } else if (error.message) {
      msg = error.message;
    }

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('error_msg', msg);
      return res.redirect(`/account/${id}`);
    } else {
      return next(new ExpressError('Update username failed!', 500));
    }
  }
};

module.exports.updateEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
  
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      req.flash('error_msg', 'Invalid email format!');
      return res.redirect(`/account/${id}`);
    }

    const user = await User.findByIdAndUpdate( id, { email }, { new: true, runValidators: true });
    if (!user) next(new ExpressError('User not found!', 404));
  
    req.flash('success_msg', 'Update email succesfully!');
    res.redirect(`/account/${id}`);
  } catch (error) {
    let msg;

    if (error.code === 11000 && error.keyPattern?.email) {
      msg = 'This email already exists!';
    } else if (error.message) {
      msg = error.message;
    }

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('error_msg', msg);
      return res.redirect(`/account/${id}`);
    } else {
      return next(new ExpressError(msg, 400));
    }
  }
}

module.exports.updateProfil = async (req, res, next) => {}

module.exports.updateFullname = async (req, res, next) => {
    try {
    const { id } = req.params;
    const { fullname } = req.body;

    const fullnameRegex = /^[A-Za-z\s]+$/;
    if (!fullnameRegex.test(fullname)) {
      req.flash('error_msg', 'Full name only contain alpabet!');
      return res.redirect(`/account/${id}`);
    }

    const fullName = fullname;
    const user = await User.findByIdAndUpdate( id, { fullName }, { new: true, runValidators: true });
    if (!user) next(new ExpressError('User not found!', 404));
  
    req.flash('success_msg', 'Update full name succesfully!');
    res.redirect(`/account/${id}`);
  } catch (error) {
    return next(new ExpressError('Update email failed!', 500));
  }
}

module.exports.updateDescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    
    const user = await User.findByIdAndUpdate( id, { description }, { new: true, runValidators: true });
    if (!user) next(new ExpressError('User not found!', 404));
  
    req.flash('success_msg', 'Update description succesfully!');
    res.redirect(`/account/${id}`);
  } catch (error) {
    return next(new ExpressError('Update description failed!', 500));
  }
}

module.exports.updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { address, instagram, facebook, twitter } = req.body;
    
    const user = await User.findByIdAndUpdate( id, { address, instagram, facebook, twitter }, { new: true, runValidators: true });
    if (!user) next(new ExpressError('User not found!', 404));
  
    req.flash('success_msg', 'Update contact succesfully!');
    res.redirect(`/account/${id}`);
  } catch (error) {
    return next(new ExpressError('Update contact failed!', 500));
  }
}

module.exports.updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, passwordConfirmation } = req.body;

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!password || password.length < 6 || !passwordPattern.test(password)) {
      req.flash('error_msg', '"password" at least 6 characters long and contain letters and numbers');
      return res.redirect(`/account/${id}`);
    }

    if (password !== passwordConfirmation) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect(`/account/${id}`);
    }
    
    const user = await User.findById(id);
    if (!user) next(new ExpressError('User not found!', 404));
  
    await user.setPassword(password);
    await user.save();

    req.login(user, (error) => {
      if (error) return next(error);
      req.flash('success_msg', 'Update password succesfully!');
      res.redirect(`/account/${id}`);
    })
  } catch (error) {
    return next(new ExpressError('Update password failed!', 500));
  }
}

module.exports.destroy = async (req, res, next) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id)

  req.flash('success_msg', 'User deleted successfully!');
  res.redirect('/');
}