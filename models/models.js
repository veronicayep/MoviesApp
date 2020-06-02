const mysql = require('mysql');
const config = require('./config');
const con = mysql.createConnection(config);

module.exports.Movies = {
    // movieIds is an array of movie_ids
    getRatings: (movieIds) => {
        return new Promise((resolve, reject) => {
            let inputArray = [movieIds];
            let sql = 'SELECT movie_id as movieId, AVG(rating) as avgRating, COUNT(rating) as votes FROM ratings WHERE movie_id IN (?) GROUP BY movieId';

            con.query(sql, inputArray, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },
};