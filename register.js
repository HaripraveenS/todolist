
const express = require('express');
const router = express.Router();
const con = require("./database");
router.get('/' , (req, res) => {
    res.send("register page");
});

router.post('/' , (req, res) => {
    res.send("register page");
    console.log(req.body.name);
    console.log("post on register");
  con.getConnection((err , connection) => {
    if(err) console.log(err);  
    connection.query(`INSERT INTO users1 (name , username , password) VALUES (? , ?, ?);`,
        [
            req.body.name,
            req.body.username,
            req.body.password
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