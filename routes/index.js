const express = require('express');
const router = express.Router();
const Movies = require('../controllers/Movies');
const { getTokenData } = require('../controllers/Auth');

// GET home page.
router.get('/', getTokenData, (req, res, next) => {
    let genres = Movies.getGenres;
    // console.log(genres);
    Movies.getMovies()
        .then((movies) => {
            let movieIds = [];
            movies.forEach((movie) => {
                movieIds.push(movie.id);
            });

            res.render('index', {
                title: 'Movies',
                movies,
                movieIds,
                genres,
                loggedIn: req.user.loggedIn,
                firstName: req.user.firstName,
            });
        })
        .catch((error) => {
            console.log('getMovies catch error', error);
            next(error);
        });
});

module.exports = router;
