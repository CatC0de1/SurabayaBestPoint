// const mongoose = require('mongoose');

// module.exports = (redirectUrl = '/') => {
//   return (req, res, next) => {
//     const paramId = ['id', 'placeId', 'reviewId'].find(param => req.params[param]);

//     if(!paramId) {
//       return next();
//     }

//     const id = req.params[paramId];
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       req.flash('error_msg', 'Invalid ID / Data not found');
//       return res.redirect(redirectUrl);
//     }

//     next();
//   }
// }


// masih belum digunakana sekarang, karena url menggunakan title

module.exports = (redirectUrl = '/') => {
  return (req, res, next) => {
    next();
  }
}