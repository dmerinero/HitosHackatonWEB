var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var usersSchema = new Schema({
  _id:       { type: String },
  email:     { type: String },
  username:  { type: String },
  password:  { type: String },
  creation:  { type: Date },
  lastLogin: { type: Date }
});

module.exports = mongoose.model("Users", usersSchema);