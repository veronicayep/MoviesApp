const express = require('express');
const router = express.Router();
const Movies = require('../controllers/Movies');
const { requireAuth } = require('../controllers/Auth');



/* GET home page. */

router.get('/', requireAuth,(req, res, next) => {
	 let genres = Movies.getGenres;
    // console.log(genres);
    Movies.getMovies().then(movies => {
        let movieIds = [];
        movies.forEach(element => {
            movieIds.push(element.id);
        });
        res.render('index', {
            title: 'Movies',
            movies,
            movieIds,
            genres,
			loggedIn: req.loggedIn
        });
    }).catch(err => {
        console.log(err);
        res.json(err);
    });
});

module.exports = router;
