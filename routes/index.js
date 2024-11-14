var express = require('express');
var router = express.Router();

require('../models/connection');
const Place = require('../models/places');
const { checkBody } = require('../modules/checkBody');

router.post('/places', (req, res) => {
  if (!checkBody(req.body, ['nickname', 'name', 'latitude', 'longitude'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { nickname, name } = req.body;
  // Conversion explicite en nombres
  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);

  // Validation des coordonnées
  if (isNaN(latitude) || isNaN(longitude)) {
    res.json({ result: false, error: 'Invalid coordinates' });
    return;
  }

  // Validation des plages de coordonnées
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    res.json({ result: false, error: 'Coordinates out of range' });
    return;
  }

  const newPlace = new Place({ 
    nickname, 
    name, 
    latitude, 
    longitude 
  });

  newPlace.save().then(() => {
    res.json({ result: true });
  });
});

router.get('/places/:nickname', (req, res) => {
  // Regex to find places regardless of nickname case
  Place.find({ nickname: { $regex: new RegExp(req.params.nickname, 'i') } })
    .then(data => {
      // Conversion des coordonnées en nombres pour chaque place
      const places = data.map(place => ({
        ...place.toObject(),
        latitude: Number(place.latitude),
        longitude: Number(place.longitude)
      }));
      
      console.log('Sending places:', places); // Log pour déboguer
      res.json({ result: true, places });
    });
  });

router.delete('/places', (req, res) => {
  if (!checkBody(req.body, ['nickname', 'name'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { nickname, name } = req.body;

  // Regex to delete place regardless of nickname case
  Place.deleteOne({ nickname: { $regex: new RegExp(nickname, 'i') }, name }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'Place not found' });
    }
  });
});

module.exports = router;
