var express = require('express');
var router = express.Router();
const Model = require('../models/models').Movies;
const Movies = require('../controllers/Movies');

// GET movie ratings
router.post('/ratings', (req, res) => {
    let movieIds = req.body.movieIds;
    Model.getRatings(movieIds)
        .then((ratings) => {
            console.log('movie.js ratings are', ratings);
            res.json(ratings);
        })
        .catch((err) => {
            console.log('Error in getRatings model function', err);
        });
});

// GET movie details
router.get('/:id', (req, res) => {
    let movieId = req.params.id;
    console.log('movie id is', movieId);
    Movies.getMovieDetails(movieId)
        .then((movieDetails) => {
            res.render('details', {
                id: movieDetails.id,
                title: movieDetails.title,
                poster: movieDetails.large_cover_image,
                year: movieDetails.year,
                synopsis: movieDetails.description_full,
            });
            // res.json(movieDetails);
        })
        .catch((err) => {
            console.log('Error in getRatings model function', err);
        });
});

module.exports = router;
