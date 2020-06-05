var express = require('express');
var router = express.Router();
const Model = require('../models/models').Movies;
const Movies = require('../controllers/Movies');
const { requireAuth } = require('../controllers/Auth');

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
router.get('/:id', requireAuth, (req, res) => {
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
                loggedIn: req.loggedIn,
                ratingOptions: [1, 2, 3, 4, 5],
                canRate: true,
            });
            // res.json(movieDetails);
        })
        .catch((err) => {
            console.log('Error in getRatings model function', err);
        });
});

router.post('/details/:movieId', requireAuth, async (req, res) => {


    const { movieId } = req.params;
    const userId = req.user;
    const rating = req.body['user-rating'];

    console.log('(details)Movie id :', movieId)
    console.log('(details)User id : ', userId);


    // Verify user loggin
    if(userId === undefined){
        console.log(' User id is undefined, please log in to rate')

    }else{
        // Check if user have rated the movie
        const canRate = await Model.canRate(movieId, userId);
        console.log(canRate);

        if(canRate){
            // User haven't rate the movie
            console.log('You can rate this movie');
            await Model.addNewRating(movieId, userId, rating);
            res.redirect('/movies/' + movieId);
            // res.render('details',{
            //     errorMessage: 'Rated successfully! Thank you!',
            //     messageClass: 'alert-success'
            // });

        }else{
            console.log('You have rated this movie.')
            res.redirect('/movies/' + movieId);
            // res.render('details', {
            //     errorMessage: 'You have rated this movie.',
            //     messageClass: 'alert-danger'
            // });
        };

    }
});

module.exports = router;
