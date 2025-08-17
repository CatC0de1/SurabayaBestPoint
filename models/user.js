const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose') 

const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Email address is not valid!']
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  profil: {
    type: String
  },
  fullName: {
    type: String,
    match: [/^[A-Za-z\s]+$/, 'Full name only contain alpabet!']
  },
  address: {
    type: String
  },
  description: {
    type: String
  },
  instagram: {
    type: String
  },
  twitter: {
    type: String
  },
  facebook: {
    type: String
  }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)