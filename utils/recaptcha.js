const axios = require('axios');
const { response } = require('express');

async function verifyRecaptcha(token) {
  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await axios.post(verifyURL, null, {
      params: {
        secret: secretKey,
        response: token,
      },
    });

    const data = response.data;

    if (data.success) {
      return { success: true, score: data.score || null };
    } else {
      return { success: false, message: 'Failed reCAPTCHA verification' };
    }
  } catch (error) {
    return { success: false, message: 'Error verifying reCAPTCHA' };
  }
}

module.exports = {
  verifyRecaptcha,
};