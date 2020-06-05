const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    setAuthToken: (userId, firstName) => {
        return new Promise(function(resolve, reject) {
            jwt.sign(
                { userId, firstName},
                'secretAccessKey',
                (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                }
            );
        });
    },

    requireAuth: (req, res, next) => {
        const token = req.cookies['AuthToken']||req.body['AuthToken'];
        console.log('(requireAuth)Token',token)
        
        if (token === 'undefined') {
            next();
        } else {
            jwt.verify(token, 'secretAccessKey', (err, user) => {
                if (err) {
                    next();
                } else {
                    console.log('(requireAuth) user id ', user.userId)
                    req.user = user.userId;
                    req.firstName = user.firstName;
                    req.loggedIn = true;
                    next();
                }
            });
        }
    },

    unsetAuthToken: (req, res, next) => {
        res.clearCookie('AuthToken');
        next();
    },

    getHashedPassword: async (password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (ex) {
            console.log(ex.message);
        }
    },
};
