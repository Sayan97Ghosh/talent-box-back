const mongoose = require("mongoose");
// taking ip and time for updating future logs
const dataSchema = mongoose.Schema({
    title:{type:String,require:true},
    duration:String,
    
});

const dataModel = mongoose.model("data", dataSchema);

module.exports = {dataModel};