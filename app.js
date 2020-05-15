//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = {
    email: String,
    password: String
};

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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
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


app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser.password === req.body.password) {
      res.render("Secrets");
    } else{
      console.log("incorrect password");
    }
    }
  });
});


app.listen(3000,function(){
  console.log("Server started on port 3000.");
})
