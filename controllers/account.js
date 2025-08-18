const fs = require('fs');
const path = require('path');
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

module.exports.updateProfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files || [];

    if (!files.length) {
      req.flash('"image" cannot empty!');
      return res.redirect(`/account/${id}`);
    }
    if (files.length > 1) {
      req.flash('"image" only contain 1 file!');
      return res.redirect(`/account/${id}`);
    }

    const file = files[0];

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      const msg = '"image" only accept .jpeg, .jpg, .png, or .webp format';
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        req.flash('error_msg', msg);
        return res.redirect(req.originalUrl);
      } else {
        return next(new ExpressError(msg, 400))
      }
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const msg = '"image" size must be less than 5MB';
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        req.flash('error_msg', msg);
        return res.redirect(req.originalUrl);
      } else {
        return next(new ExpressError(msg, 400))
      }
    }

    const user = await User.findById(id);
    if (!user) return next(new ExpressError('User not found!', 404));

    // Menghapus foto lama jika ada
    if (user.profil && user.profil.url) {
      try {
        const oldPath = path.join(__dirname, '../public', user.profil.url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (error) {
        return next(new ExpressError(error, 500));
      }
    }

    user.profil = {
      url: `/images/profiles/${file.filename}`,
      filename: file.filename
    };

    await user.save();
  
    req.flash('success_msg', 'Update profile picture succesfully!');
    res.redirect(`/account/${id}`);
  } catch (error) {
    return next(new ExpressError('Update email failed!', 500));
  }  
}

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

module.exports.destroyImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) return next(new ExpressError('User not found', 404));

    if (user.profil && user.profil.url) {
      const imagePath = path.join(__dirname, '../public', user.profil.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      user.profil = {
        url: null,
        filename: null
      };
    }

    await user.save();


    req.flash('success_msg', 'Photo Profile deleted successfully!');
    return res.redirect(`/account/${user._id}`);
  } catch (error) {
    req.flash('error_msg', error);
    return res.redirect(`/account/${user._id}`);
  }
}

module.exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return next(new ExpressError('User not found', 404));

    // hapus profil kalau ada
    if (user.profil && user.profil.url) {
      const imagePath = path.join(__dirname, '../public', user.profil.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // hapus user
    await User.findByIdAndDelete(id);

    if (req.user && req.user._id.toString() === id.toString()) {
      req.logout(err => {
        if (err) return next(err);
        req.flash('success_msg', 'Your account has been deleted successfully!');
        return res.redirect('/');
      });
    } else {
      req.flash('success_msg', 'User deleted successfully!');
      return res.redirect('/');
    }

  } catch (error) {
    return next(new ExpressError('Failed to delete account!', 500));
  }
}