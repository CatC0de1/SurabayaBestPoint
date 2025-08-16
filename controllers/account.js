const User = require('../models/user');
const ExpressError = require('../utils/ErrorHandler');


module.exports.show = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) next(new ExpressError('User not found', 404));
  
  res.render('account/show', { user });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body; // contoh field

  const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
  if (!user) next(new ExpressError('User not found', 404));
  
  res.redirect(`/account/${id}`);
};

module.exports.destroy = async (req, res, next) => {
  next()
}