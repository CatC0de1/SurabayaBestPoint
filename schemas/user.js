const Joi = require('joi');

module.exports.userSchema = Joi.object({
  username: Joi
    .string()
    .min(3)
    .pattern(/^[a-z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': '"username" only contain lowercases, numbers, and underscores'
    }),
  email: Joi.string().email().required(),
  birthday: Joi.string().isoDate().required(),
  gender: Joi
    .string()
    .valid('Male', 'Female')
    .required()
    .messages({
      'any.only': '"gender" must be either Male or Female.'
    }),
  password: Joi
    .string()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    .required()
    .messages({
      'string.pattern.base': '"password" must contain letters and numbers'
    }),
  passwordConfirmation: Joi
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match'
    }),
})