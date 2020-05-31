const express = require("express");
const router = express.Router();
const con = require('./database');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const {checkToken } = require('../auth/token');


router.get('/' ,checkToken, function (req , res){
    var token = req.get("authorization");
    token = token.slice(7);
    const payload = jwt.verify(token, "shhhh");
    console.log(payload);
    var uid1 = payload.details.id;
    con.getConnection( (err , connection) => {
    if(err) console.log(err);
    console.log("connection established");
    connection.query(`SELECT * FROM todos WHERE usid = ?`,
        [uid1],
        function(err , results , feilds){
        if(err) {console.log(err);}
        console.log(results);
        // console.log(results.password);
        res.send(JSON.stringify(results))
        // res.send(results[0].title + results[0].body);
        
    });
});
});


router.post('/' ,checkToken, function (req , res){
    var token = req.get("authorization");
    token = token.slice(7);
    const payload = jwt.verify(token, "shhhh");
    console.log(req.body.title);
    var todet = req.body.title;
    var todobody = req.body.bod;
    var uid1 = payload.details.id;
    con.getConnection( (err , connection) => {
    if(err) console.log(err);
    console.log("connection established");
    connection.query(`INSERT INTO todos (title , body , usid ) VALUES (?,? ,?)` ,
        [
            todet,
            todobody,
            uid1
        ],
        function(err , results , feilds){
        if(err) {console.log(err);}
        // console.log(results);
        // console.log(results.password);
        // res.send(JSON.stringify(results))
        // res.send(results[0].title + results[0].body);
        else {
            res.send("todo added successfully");
        }
    });
});
});



module.exports = router;