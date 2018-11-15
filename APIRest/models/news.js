var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var newsSchema = new Schema({
  _id:      { type: String },
  title:    { type: String },
  date:     { type: Date   },
  country:  { type: String },
  text:     { type: String },
  author:   { type: String },
  section:  { type: String, enum:
    ['', 'Politic', 'Sport', 'Weather', 'Economy', 'Disaster']
        }
});

module.exports = mongoose.model("News", newsSchema);