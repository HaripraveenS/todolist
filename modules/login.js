const express = require('express');
const router = express.Router();
const con = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
router.post('/' , function (req,res) {
    con.getConnection((err , connection) => {
        connection.query("SELECT * FROM users1 WHERE username= ?"
        ,[
            req.body.username
        ],
        function(err , results , fields){
            if(err) console.log(err);
            // console.log(results);
            // res.send("hello");
            // console.log(req.body.password);
            if(!results){
                return res.json({
                    success:0,
                    message:"invalid username or password"
                });
            }
            if(bcrypt.compareSync(req.body.password ,results[0].password))
            {
                console.log("login successful");
                results[0].password = null;
                var token = jwt.sign({details : results[0]} , 'shhhh');

                res.json({
                    success:1,
                    message:"login successful!",
                    token : token
                })
            }
            else { 
                console.log("login not successful");
                res.json({
                    success:0,
                    message:"invalid username or password"
                })

            }
        });
    });
});


module.exports = router;