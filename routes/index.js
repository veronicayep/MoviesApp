const express = require('express');
const router = express.Router();
const Movies = require('../controllers/Movies');

/* GET home page. */
router.get('/', (req, res, next) => {
    Movies.getMovies().then(movies => {
        let movieIds = [];
        movies.forEach(element => {
            movieIds.push(element.id);
        });
        res.render('index', {
            title: 'Movies',
            movies,
            movieIds,
        });
    }).catch(err => {
        console.log(err);
        res.json(err);
    });
});

module.exports = router;
