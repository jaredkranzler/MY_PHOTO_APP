const mongoose = require('mongoose');
const User = require('./users');

const photoSchema = mongoose.Schema({
  title: String,
  url: String,
  body: String
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
