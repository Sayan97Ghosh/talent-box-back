const express = require('express');
const cors = require("cors");
const { connection } = require('./connection/db');
const { userRouter } = require('./routes/user.routes');
const { dataRoute } = require('./routes/data.routes');
const session = require('express-session');
const passport = require("passport");
require("dotenv").config();
require("./routes/passport.routes");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors({
    origin: "*",
  }
))


app.use(session({
    secret: 'glube',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());


// user
app.use("/",userRouter);
// courses
app.use("/courses",dataRoute);

app.listen(process.env.PORT, async ()=>{
    try{
        await connection;
        console.log("connection successful!")
    }catch(err){
        console.log("connection failed")
    }

    console.log(`server listen on port ${process.env.PORT}`)
})
