const express = require("express");
const cors  = require("cors");
const app = express();
const router = express.Router();
const register = require('./modules/register');
const login = require('./modules/login');
const mysql = require('mysql');
const con = require('./modules/database');
const todo = require('./modules/todo');
app.use(express.json());
const jwt = require('jsonwebtoken');
const {checkToken } = require('./auth/token');
app.use('/register' , register);
app.use('/login' , login);
app.use('/todo' , todo);
app.use('/' , router);
app.listen(3000 , ()=>{
    console.log("listening on port 3000");
})

