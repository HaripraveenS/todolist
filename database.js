const mysql = require("mysql");

var con = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'login',
    connectionLimit : 10
})

module.exports = con;