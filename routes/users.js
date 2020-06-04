const { setAuthToken, requireAuth, unsetAuthToken } = require("../controllers/Auth");
const { Users } = require("../models/models");
var express = require('express');
var router = express.Router();


router.get('/login', (req, res) => { 
    // http://localhost:3000/users/login 
    res.render("login");
});

router.get("/signup", (req, res) => {
    // http://localhost:3000/users/signup
    res.render("signup"); 
});

 //----------------------------------------Sign Up------------------------------//
 
 router.post("/signup", async(req, res) => { 
     console.log("signing up...")       
    const { firstName, surname , email, password, confirmPassword } = req.body;
    console.log(firstName)
    console.log(email)
    if(email && password){

        // Check if the password and confirm password fields match
        if (password === confirmPassword) {

            // Check if user with the same email is also registered
            console.log("validating...")
            const user = await Users.validateSignUp(email)
            console.log(user)
            // If user is not exist yet
            if(user === undefined){
                // Store new user into the database 
                console.log("storing...")
                let successful = await Users.createNewUser(surname, firstName, email, password);
                // Registration completed, redirect user to login
                if(successful){
                    res.render('login', {
                    message: 'Registration Complete. Please login to continue.',
                    messageClass: 'alert-success'
                    });
                }else {
                    console.log("Failed to store data")
                }

            }else {
                res.render('signup', {
                    message: 'User already registered.',
                    messageClass: 'alert-danger'
                });
            }

        }else {
            res.render('signup', {
                message: 'Password does not match.',
                messageClass: 'alert-danger'
            });
        }
    }   

});

// ----------------------------Submit login---------------------------// 

var authTokens = {};
router.post("/login", async (req, res) => {
  const {email, password} = req.body;
    // Check input is not empty
    if(email && password){

        // Matching email and password with database
        let user = await Users.getLoginAuth(email, password);
        // If user exist and password is correct
        if (user) {    
            //  Create access token and set it in cookies
            setAuthToken(user.id).then(function(result){
                const accessToken =  result;
                res.cookie('AuthToken',accessToken);
                res.redirect('/'); 
            });

        }else {
            // If user is not exist or wrong password
            res.render('login', {
                message: 'User is not exist',
                messageClass: 'alert-danger'
            });
        }
    }   
})


//-------------------------------------Logout-------------------------------//

router.get("/logout",unsetAuthToken, (req, res) => {
    res.redirect('/');
});





module.exports = router;
