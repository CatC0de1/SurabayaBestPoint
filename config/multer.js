const multer = require('multer');
const path = require('path');

// utils
const ExpressError = require('../utils/ErrorHandler');

function upload(directory) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let dir;

      if (directory === 'places') {
        dir = path.join(__dirname, '../public/images/places');
      } else if (directory === 'profiles') {
        dir = path.join(__dirname, '../public/images/profiles');
      } else {
        return cb(new ExpressError('Invalid upload directory!', 400));
      }

      cb(null, dir)
    },
  
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  return multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith('image/')) { 
        cb(null, true);
      } else {
        cb(new ExpressError('Only images are allowed!', 405));
      }
    } 
  });
}

module.exports = upload;