const express = require('express');
const router = express.Router();
const con = require("./database");
const bcrypt = require('bcrypt');
const saltro = 10;
router.get('/' , (req, res) => {
    res.send("register page");
});

router.post('/' , (req, res) => {
    // res.send("register page");
    console.log(req.body.name);
    console.log("post on register");
    var passwor = bcrypt.hashSync(req.body.password , 10);
  con.getConnection((err , connection) => {
    if(err) console.log(err);  
    connection.query(`INSERT INTO users1 (name , username , password) VALUES (? , ?, ?);`,
        [
            req.body.name,
            req.body.username,
            passwor
        ],
        (err , results, feilds) => {
            if(err) console.log(err);
            console.log(results);
            console.log("added successfully");
            res.json({
                success:1,
                message:"user added successfully"
            });
        }
    )
  })
});
module.exports = router;