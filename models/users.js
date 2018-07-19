const mongoose = require('mongoose');
const Photo = require('./photos');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  photos: [Photo.schema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;