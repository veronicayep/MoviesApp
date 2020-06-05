const { setAuthToken, unsetAuthToken } = require('../controllers/Auth');
const { Users } = require('../models/models');

const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    // http://localhost:3000/users/login
    res.render('login', {
        title: 'Login',
    });
});

router.get('/signup', (req, res) => {
    // http://localhost:3000/users/signup
    res.render('signup', {
        title: 'Sign up',
    });
});

//----------------------------------------Sign Up------------------------------//

router.post('/signup', async (req, res) => {
    console.log('signing up...');
    const { firstName, surname, email, password, confirmPassword } = req.body;
    console.log(firstName);
    console.log(email);
    if (email && password) {
        // Check if the password and confirm password fields match
        if (password === confirmPassword) {
            // Check if user with the same email is also registered
            console.log('validating...');
            const user = await Users.validateSignUp(email);
            console.log(user);
            // If user is not exist yet
            if (user === undefined) {
                // Store new user into the database
                console.log('storing...');
                let successful = await Users.createNewUser(
                    firstName,
                    surname,
                    email,
                    password
                );
                // Registration completed, redirect user to login
                if (successful) {
                    setAuthToken(successful.insertId, firstName).then(
                        (result) => {
                            const accessToken = result;
                            res.cookie('AuthToken', accessToken);
                            res.redirect('/');
                        }
                    );
                } else {
                    console.log('Failed to store data');
                }
            } else {
                res.render('signup', {
                    title: 'Sign up',
                    errorMessage: 'User already registered.',
                    firstName,
                    surname,
                    email,
                    password,
                    confirmPassword,
                });
            }
        } else {
            res.render('signup', {
                title: 'Sign up',
                errorMessage: 'Passwords do not match.',
                firstName,
                surname,
                email,
                password,
                confirmPassword,
            });
        }
    }
});

// ----------------------------Submit login---------------------------//

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check input is not empty
    if (email && password) {
        // Matching email and password with database
        let user = await Users.getLoginAuth(email, password);
        // If user exist and password is correct
        if (user) {
            //  Create access token and set it in cookies
            setAuthToken(user[0].id, user[0].firstName).then(function (result) {
                const accessToken = result;
                res.cookie('AuthToken', accessToken);
                res.redirect('/');
            });
        } else {
            // If user does not exist or wrong password
            console.log('User not found or password did not match.');
            res.render('login', {
                title: 'Login',
                errorMessage: 'Email or password incorrect. Please try again.',
                email,
                password,
            });
        }
    }
});

//-------------------------------------Logout-------------------------------//

router.get('/logout', unsetAuthToken, (req, res) => {
    res.redirect('/');
});

module.exports = router;
