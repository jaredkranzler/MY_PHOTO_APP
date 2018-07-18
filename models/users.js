const mongoose = require('mongoose');
const Photo = require('./photos');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  photos: [Photo.schema]
});

module.exports = mongoose.model('User', userSchema);
