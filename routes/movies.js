var express = require('express');
var router = express.Router();
const { Movies } = require('../models/models');

// GET movie ratings.
router.post('/ratings', (req, res, next) => {
    let movieIds = req.body.movieIds;
    Movies.getRatings(movieIds).then(ratings => {
        console.log('movie.js ratings are', ratings);
        res.json(ratings);
    }).catch(err => {
        console.log('Error in getRatings model function', err);
    });
});

module.exports = router;
