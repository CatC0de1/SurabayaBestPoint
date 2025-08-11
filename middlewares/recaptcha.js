const { verifyRecaptcha } = require('../utils/recaptcha');

async function recaptcha(req, res, next) {
  const token = req.body['g-recaptcha-response'];

  const result = await verifyRecaptcha(token);

  if (!result.success) {
    req.flash('error_msg', 'reCAPTCHA verification failed');
    return res.redirect('/login');
  }

  next();
}

module.exports = recaptcha;