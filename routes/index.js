const express = require('express');
const router = express.Router();
const Movies = require('../controllers/Movies');
const { requireAuth } = require('../controllers/Auth');

// GET home page.
router.get('/', requireAuth, (req, res, next) => {
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
                loggedIn: req.loggedIn,
                firstName: req.firstName,
            });
        })
        .catch((error) => {
            console.log(error.response);
            res.json(error.response);
        });
});

module.exports = router;
