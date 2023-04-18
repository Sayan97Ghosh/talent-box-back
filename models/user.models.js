const mongoose = require("mongoose");
// taking ip and time for updating future logs
const userSchema = mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    oauthProvider: {
        type: String,
        enum: ['google'],
      },
    oauthid : String,
});

const userModel = mongoose.model("user", userSchema);
module.exports = {userModel};