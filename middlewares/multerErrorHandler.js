const ExpressError = require('../utils/ErrorHandler');

module.exports = (uploadMiddleware, current) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, function(err) {
      // const { title } = req.params;
      // let place = await place.findOne({ title });

      if (err) {
        // Tangani error Multer
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          req.flash('error_msg', 'Maximum 5 images are allowed!');
          return res.status(400).json({ error: 'Maximum 5 images are allowed!' });
          
          if (current === 'create') {
            return res.redirect('/places/create');
          } else if (current === 'edit') {
            return res.redirect(`/places/${req.params.title}/edit`);
          } else {
            return res.redirect('/places');
          }          
        }
        // Error lain dari multer atau custom error
        return next(new ExpressError(err.message, err.statusCode || 500));
      }
      next();
    });
  };
};
