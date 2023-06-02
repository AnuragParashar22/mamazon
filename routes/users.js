const mongoose = require('mongoose');
var plm = require('passport-local-mongoose');
const dotenv = require("dotenv").config();


const db = process.env.database;

mongoose.connect(db).then(function(){
  console.log("connected to db");
})

var userSchema = mongoose.Schema({
  name:String,
  username:String,
  password:String,
  email:String,
  Number:String,
  sellor:{
    type:Boolean,
    default:false
  },
  image:String,
  gstno:Number,
  address:String,
  products: [{
     type:mongoose.Schema.Types.ObjectId,
     ref:'products'
  }]
}
)


userSchema.plugin(plm);
module.exports = mongoose.model('user', userSchema);