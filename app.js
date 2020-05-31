const express = require("express");
const cors  = require("cors");
const app = express();
const router = express.Router();
const register = require('./register');
const mysql = require('mysql');
const con = require('./database');
app.use(express.json());
const jwt = require('jsonwebtoken');
const {checkToken } = require('./auth/token');
app.use('/register' , register);
router.get('/user' ,checkToken, function (req , res){
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
router.post('/user' ,checkToken, function (req , res){
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

router.post('/login' , function (req,res) {
    con.getConnection((err , connection) => {
        connection.query("SELECT * FROM users1 WHERE username= ?"
        ,[
            req.body.username
        ],
        function(err , results , fields){
            if(err) console.log(err);
            console.log(results);
            // res.send("hello");
            console.log(req.body.password);
            if(!results){
                return res.json({
                    success:0,
                    message:"invalid username or password"
                });
            }
            if(results[0].password == req.body.password)
            {
                console.log("login successful");
                var token = jwt.sign({details : results[0]} , 'shhhh');

                res.json({
                    success:1,
                    message:"login successful!",
                    token : token
                })
            }
            else { 
                console.log("login unsuccessful");
                res.json({
                    success:0,
                    message:"login unsuccessful!"
                })

            }
        });
    });
});
app.use('/' , router);
app.listen(3000 , ()=>{
    console.log("listening on port 3000");
})

