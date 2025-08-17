const User = require('../models/user');
const ExpressError = require('../utils/ErrorHandler');


module.exports.show = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) next(new ExpressError('User not found', 404));
  
  res.render('account/show', { user });
};

module.exports.updateUsername = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  // validasi username
  const usernamePattern = /^[a-z0-9_]+$/;
  if (!username || username.length < 3 || !usernamePattern.test(username)) {
    req.flash('error_msg', '"username" at least 3 characters long and only contain lowercases, numbers, and underscores');
    return res.redirect(`/account/${id}`);
  }

  const user = await User.findByIdAndUpdate( id, { username }, { new: true, runValidators: true });
  if (!user) next(new ExpressError('User not found', 404));
  
  req.flash('success_msg', 'Update username succesfully, login to see your update')
  res.redirect('/login');
};

module.exports.destroy = async (req, res, next) => {
  next()
}