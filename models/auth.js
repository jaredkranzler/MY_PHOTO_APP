const mongoose = require('mongoose');


const authSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String
});


module.exports = mongoose.model('Auth', authSchema);

