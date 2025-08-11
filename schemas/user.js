const Joi = require('joi');

module.exports.userSchema = Joi.object({
  user: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required()
  }).required(),
})