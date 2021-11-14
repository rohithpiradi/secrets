require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB",()=>{
  console.log("database is connected");
});

const userschema=new mongoose.Schema({
  email:String,
  password:String
});

userschema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

const users=mongoose.model("users",userschema);

const app = express();
app.use(bodyParser.urlencoded({extended :true}));

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000, function(){
  console.log("server is running on port 3000");
});

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
  const user=new users({
    email:req.body.username,
    password:req.body.password
  });

  user.save((err)=>{
    if(err)
      console.log(err);
    else {
      res.render("secrets");
    }
  });

});

app.post("/login",function(req,res){

  const username=req.body.username;
  const password=req.body.password;

  users.findOne({email:username},(err,user)=>{
    if(err)
      console.log(err);
    else{
        if(user){
          if(user.password===password)
            res.render("secrets");
          else
            res.redirect("login");
        }else{
          res.redirect("register");
        }
    }
  });
});
