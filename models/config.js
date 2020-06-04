require('dotenv').config();

module.exports = {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'project5',
};
