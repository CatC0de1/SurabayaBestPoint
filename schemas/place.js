const Joi = require('joi');

module.exports.placeSchema = Joi.object({
  place: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    // images: Joi
    //   .array()
    //   .items(
    //     Joi.object({
    //       mimetype: Joi
    //         .string()
    //         .valid('image/jpeg', 'image/png', 'image/webp')
    //         .required()
    //         .messages({
    //           'any.only': '"images" only accept .jpeg, .jpg, .png, or .webp format'
    //         }),
    //       size: Joi
    //         .number()
    //         .max(10*1024*1024)
    //         .required()
    //     })
    //   )
    //   .max(5)
    //   .optional()
  }).required()
})
