const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    setAuthToken: (userId, firstName) => {
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        loggedIn = true;
        return new Promise(function (resolve, reject) {
            jwt.sign(
                { userId, firstName, loggedIn },
                'secretAccessKey',
                // { expiresIn: '10m' },
                (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                }
            );
        });
    },

    getTokenData: (req, res, next) => {
        const token = req.cookies['AuthToken'] || req.body['AuthToken'];
        console.log('(getTokenData) Token', token);

        if (token === undefined) {
            req.user = {
                userId: undefined,
                firstName: undefined,
                loggedIn: false,
            };
            console.log('(getTokenData) is undefined. req.user set to', req.user);
            next();
        } else {
            jwt.verify(token, 'secretAccessKey', (err, user) => {
                if (err) {
                    console.log('(getTokenData) jwt.verify err', err);
                    next(err);
                } else {
                    console.log('(getTokenData) user', user);
                    req.user = user;
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
