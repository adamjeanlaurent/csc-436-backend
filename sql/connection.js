const mysql = require('mysql2');

let USER = 'ajeanlau_rent';
let DATABASE = 'ajeanlau_quiz';
let PASSWORD = 'throwaway1234';
let HOST = '192.185.94.20';

// initialize reusable sql connection
const connection = mysql.createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});

module.exports = connection;