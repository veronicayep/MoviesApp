const mysql = require('mysql');
const bcrypt = require("bcrypt");
const config = require('./config');
const { setAuthToken, getHashedPassword } = require("../controllers/Auth");
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

module.exports.Users =  {

    getUserData: (id) =>{	 
        return new Promise((resolve, reject) => {
            let input = [id];
            let sql = "SELECT * FROM users WHERE id = ?";

            con.query(sql, input, (err, result) => {
               if (err) reject (err);
               resolve(result);
            });
         })
     },
     
     
    getLoginAuth:  async (email, password) => {
        return new Promise((resolve, reject) => {
            let input = [email];
            let sql = "SELECT * FROM users WHERE email =?";

            con.query(sql,input, async(err, userData) => {
                const compareResult = await bcrypt.compare(password, userData[0].password)
                if(compareResult){
                    resolve(userData)
                }else{
                    reject(err);
                }
           });
        }) 
    },

    validateSignUp: (email) =>{
        return new Promise((resolve,reject) => {
            let input = [email];
            let sql = "SELECT * FROM users WHERE email = ?";
           
            con.query(sql,input,(err,userData) => {
                if(err)reject(err);
                const user = userData.find(user => user.email === email);
                resolve(user);
           })
        })
    },

    createNewUser:async(surname, firstName, email, password)=>{

        let hashedPassword = await getHashedPassword(password);
        return new Promise((resolve,reject) => {
           var sql = "INSERT INTO users (surname,first_name, email, password) VALUES ?";
           var inputArray = [[surname, firstName, email, hashedPassword]];
           con.query(sql,[inputArray], (err, result) => {
               if (err) reject (err);
               resolve(result)
               console.log("1 record inserted into users database");
           });
        })
    } 


};