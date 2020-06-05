var express = require('express');
var router = express.Router();
const Model = require('../models/models').Movies;
const Movies = require('../controllers/Movies');
const { getTokenData } = require('../controllers/Auth');

// GET movie ratings from AJAX call and return JSON data
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
router.get('/:id', getTokenData, async (req, res, next) => {
    let movieId = req.params.id;
    console.log('movie id is', movieId);

    let canRate;
    if (req.user.userId) {
        console.log('req.user.userId true', req.user.userId);
        canRate = Model.canRate(movieId, req.user.userId)
            .then((allow) => {
                canRate = allow;
                console.log('canRate', canRate);
            })
            .catch((err) => {
                console.log('canRate error', err);
                next(err);
            });
    }

    Movies.getMovieDetails(movieId, next)
        .then((movieDetails) => {
            console.log('canRate', canRate);

            res.render('details', {
                id: movieDetails.id,
                title: movieDetails.title,
                poster: movieDetails.large_cover_image,
                year: movieDetails.year,
                synopsis: movieDetails.description_full,
                loggedIn: req.user.loggedIn,
                ratingOptions: [1, 2, 3, 4, 5],
                canRate,
            });
            // res.json(movieDetails);
        })
        .catch((err) => {
            console.log('Error in getRatings model function', err);
            next(err);
        });
});

router.post('/details/:movieId', getTokenData, async (req, res) => {
    const { movieId } = req.params;
    const { userId } = req.user;
    const rating = req.body['user-rating'];

    console.log('(details) Movie ID:', movieId);
    console.log('(details) User ID: ', userId);

    // Verify user loggin
    if (userId === undefined) {
        console.log(' User ID is undefined, please log in to rate');
        res.redirect('/movies/' + movieId);
    } else {
        // Check if user have rated the movie
        const canRate = await Model.canRate(movieId, userId);
        console.log(canRate);

        if (canRate.allow === true) {
            // User haven't rate the movie
            console.log('You can rate this movie');
            await Model.addNewRating(movieId, userId, rating);
            res.redirect('/movies/' + movieId);
            // res.render('details', {
            //     message: {
            //         message: 'Rated successfully! Thank you!',
            //         class: 'alert-success',
            //     },
            // });
        } else {
            console.log('You have already rated this movie.');
            res.redirect('/movies/' + movieId);
            // res.render('details', {
            //     message: {
            //         message: 'You have rated this movie.',
            //         class: 'alert-danger',
            //     },
            // });
        }
    }
});

module.exports = router;
