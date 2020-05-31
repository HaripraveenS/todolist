const express = require("express");
const router = express.Router();
const con = require('./database');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const {checkToken } = require('../auth/token');
const EventEmitter = require('events');
class dbquery extends EventEmitter { }
const dbemit = new dbquery();
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
        // console.log(results);
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
    var todobody = req.body.body;
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
        else {
            res.send("todo added successfully");
        }
    });
});
});

router.put('/' ,checkToken, function (req , res){
    var token = req.get("authorization");
    token = token.slice(7);
    const payload = jwt.verify(token, "shhhh");
    var oldtitle = req.body.oldtitle;
    var newtitle = req.body.newtitle;
    var newtodobody = req.body.newbody;
    var uid1 = payload.details.id;
    var actual_uid;
    con.getConnection( (err , connection) => {
    if(err) console.log(err);
    console.log("connection established");
    connection.query(`SELECT usid from todos WHERE title=?`,
        [oldtitle],
        function(err , results , feilds){
            if(err){
                console.log(err);
                res.json({
                    success:0,
                    message:"error in connecting with database"
                })
            }
            else {
                if(results.length == 0)
                {
                    res.json({
                        success:0,
                        message:"no such todo exists"
                    })
                }
                else{
                    actual_uid = results[0].usid;
                // console.log(actual_uid + "slafh");
                // res.send("askldhf");
                dbemit.emit('gotuid');
                }
            }
        }
    
    )});
    dbemit.on('gotuid', ()=> {
        // console.log(actual_uid + "lslhdfslakdgh");
    
    // console.log(assert.equal(uid1,actual_uid));
    if(uid1 != actual_uid){
        res.json({
            success:0,
            message:"this is not your todo so you cannot modify it"
        })
    }
    else {
        con.getConnection( (err , connection) => {
        connection.query(`UPDATE todos SET title=? , body=? , usid=?  WHERE title=?` ,
        [
            newtitle,
            newtodobody,
            uid1,
            oldtitle
        ],
        function(err , results , feilds){
        if(err) {console.log(err);}
        // res.send(JSON.stringify(results))
        // res.send(results[0].title + results[0].body);
        else {
            res.send("todo updated successfully");
        }
    });
    });

    }
    });
});

module.exports = router;