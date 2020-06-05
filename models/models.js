const mysql = require('mysql');
const bcrypt = require('bcrypt');
const config = require('./config');
const { getHashedPassword } = require('../controllers/Auth');
const con = mysql.createConnection(config);

module.exports.Movies = {
    // movieIds is an array of movie_ids
    getRatings: (movieIds) => {
        return new Promise((resolve, reject) => {
            let inputArray = [movieIds];
            let sql =
                'SELECT movie_id as movieId, AVG(rating) as avgRating, COUNT(rating) as votes FROM ratings WHERE movie_id IN (?) GROUP BY movieId';

            con.query(sql, inputArray, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },
};

module.exports.Users = {
    getUserData: (id) => {
        return new Promise((resolve, reject) => {
            let input = [id];
            let sql = 'SELECT * FROM users WHERE id = ?';

            con.query(sql, input, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    getLoginAuth: async (email, password) => {
        return new Promise((resolve, reject) => {
            let input = [email];
            let sql = 'SELECT id, password FROM users WHERE email = ?';

            con.query(sql, input, async (queryErr, userData) => {
                if (queryErr) reject(queryErr);

                console.log('userData is',  userData);
                
                if (userData.length > 0) {
                    let retrievedPassword = userData[0].password;
                    bcrypt.compare(password, retrievedPassword, function(compareErr, result) {
                        if (compareErr) {
                            console.log('bcrypt.compare compareErr is', compareErr);
                            reject(compareErr);
                        }
                        if (result === true) {
                            resolve(result);
                        } else {
                            console.log('Passwords do not match');
                            resolve(result);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });
    },

    validateSignUp: (email) => {
        return new Promise((resolve, reject) => {
            let input = [email];
            let sql = 'SELECT * FROM users WHERE email = ?';

            con.query(sql, input, (err, userData) => {
                if (err) reject(err);
                const user = userData.find((user) => user.email === email);
                resolve(user);
            });
        });
    },

    createNewUser: async (firstName, surname, email, password) => {
        let hashedPassword = await getHashedPassword(password);
        return new Promise((resolve, reject) => {
            var sql =
                'INSERT INTO users (first_name, surname, email, password) VALUES ?';
            var inputArray = [[firstName, surname, email, hashedPassword]];
            con.query(sql, [inputArray], (err, result) => {
                if (err) reject(err);
                resolve(result);
                console.log('1 record inserted into users database');
            });
        });
    },
};
