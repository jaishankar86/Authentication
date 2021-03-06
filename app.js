//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// const secret = "Thisisourlittlesecret";
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedfields:['password'] });


const User = new mongoose.model('User',userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

    app.post("/register",function(req,res){
bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(err){
        if (err){
          console.log(err);
        } else{
          res.render("Secrets");
        }
      }
    );

    });
});




app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
    if(result === true){
      res.render("Secrets");
    }
});
        } else{
        console.log("incorrect password");
      }
      }

  });
});


app.listen(3000,function(){
  console.log("Server started on port 3000.");
})
