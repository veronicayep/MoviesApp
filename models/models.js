const mysql = require('mysql');
const config = require('./config');
const con = mysql.createConnection(config);