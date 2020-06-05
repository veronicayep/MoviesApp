const axios = require('axios');

module.exports = {
    getMovies: () => {
        let movies = axios.get('https://yts.mx/api/v2/list_movies.json')
            .then((response) => {
                // handle success
                let data = response.data.data.movies;
                return data;
            }).catch((error) => {
                // handle error
                console.log(error);
            });
        return movies;
    },

    getGenres: [
        'Action',
        'Adventure',
        'Animation',
        'Biography',
        'Comedy',
        'Crime',
        'Documentary',
        'Drama',
        'Family',
        'Fantasy',
        'Film Noir',
        'History',
        'Horror',
        'Music',
        'Musical',
        'Mystery',
        'Romance',
        'Sci-Fi',
        'Short Film',
        'Sport',
        'Superhero',
        'Thriller',
        'War',
        'Western',
    ],

    getMovieDetails: (movieId, next) => {
        let url = 'https://yts.mx/api/v2/movie_details.json?movie_id=' + movieId;
        console.log('url is', url);
        let details = axios.get(url)
            .then((response) => {
                // handle success
                let data = response.data.data.movie;
                return data;
            }).catch((error) => {
                // handle error
                console.log(error);
                next(error);
            });
        return details;
    },
};