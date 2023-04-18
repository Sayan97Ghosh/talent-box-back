const express = require('express');
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require('../models/user.models');
const { passportAuthSuccessMiddleware } = require('../middleware/passport.middleware');
const passport = require('passport');

const storage = require('node-sessionstorage')
// get user

userRouter.get("/users", async(req, res) => {
    try{
  
      const getusers = await userModel.find();
            res.send(getusers);
  
    }catch(er){
      res.status(400).send({ message: err.message });
  
    }
   
  });
//   signup
userRouter.post("/signup", async (req, res) => {
    const { name,email, password } = req.body;
    const ip = req.ip;
    const time =new Date();
   
    try {
      const userPresent = await userModel.findOne({ email });
      if (userPresent) {
        res.send(" User Already registered");
      } else {
        bcrypt.hash(password, 5, async function (err, hash) {
          const userDetails = new userModel({ name,email, password: hash, ip:ip, time:time });
          await userDetails.save();
          console.log("data is added");
          res.status(200).send("signup successful");
        });
      }
    } catch (err) {
      res.status(400).send({ message: err.message });
      console.log("data adding failed");
    }
  });
// login
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.find({ email });
      const hashed_password = user[0].password;

      if(user.length == 0) res.status(300).send("User is Not present please signup")
  
      if (user.length > 0) {
        bcrypt.compare(password, hashed_password, function (err, result) {
          // result == true
          if (result) {
            const token = jwt.sign({ userId: user[0]._id }, "shhh", {
              expiresIn: "24h",
            });
            res.send({ message: "login successful ", token: `${token}` });
          } else {
            res.send("login failed");
          }
        });
      } else {
        res.send("login failed");
      }
    } catch (err) {
      res.status(400).send({ message: err.message });
      console.log("data adding failed");
    }
  });

  // this is google auth callback

  const googleAuthCallback = (req, res) => {
    // Redirect user to frontend with the JWT token as a cookie
    const token = jwt.sign({name: "sayan" }, "shhh", {
      expiresIn: "24h",
    });
    
    // this is for local storage
    //Setting store key and data
   

      storage.setItem('foo', 'bar')
  // this is for cookies
    res.cookie('jwt', token);

    // res.redirect('http://localhost:3000/harvest/signin');
    res.send('<script>window.opener.location.href="http://localhost:3000/private/home"; window.close();</script>');

}

const getUserDetail = async (req , res) => {

    try {

        const isUserValid = await userModel.findOne({
            $or : [
                {oauthid : req.userId},
                {id : req.userId}
            ]
        })

        if (isUserValid) {
            
            return res.json({
                fullName : isUserValid.name,
                email : isUserValid.email
            })
        }
        
    } catch (error) {
        console.log(error)
    }
} 
  

  // this is google



userRouter.get('/google' , 
passport.authenticate('google', { scope: ['profile', 'email'] , prompt: 'select_account' })
)

userRouter.get("/google/callback" , passportAuthSuccessMiddleware(passport) , googleAuthCallback)




  module.exports = { userRouter };
  