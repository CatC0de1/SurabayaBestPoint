module.exports = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    return res.redirect('/login');
  }
}