const jwt = require("jsonwebtoken");

module.exports = {
    checkToken : (req, res, next)=>{
        var token = req.get("authorization");
        if(token){
            token = token.slice(7);
            jwt.verify(token ,"shhhh" , (err, decoded) => {
                if(err){
                    res.send("unauthorized user!!!");
                }
                else {
                    next();
                }
            });
        }

    }
}