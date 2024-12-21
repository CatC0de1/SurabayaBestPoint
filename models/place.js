const mongoose = require('mongoose')
const Schema = mongoose.Schema

const placeSchema = new Schema({
  title: { type: String, unique: true },
  price: Number,
  description: String,
  location: String,
  image: String
})

module.exports = mongoose.model('Place', placeSchema)