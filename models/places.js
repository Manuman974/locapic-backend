const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
  nickname: String,
  name: String,
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  }
});

const Place = mongoose.model('places', placeSchema);

module.exports = Place;
