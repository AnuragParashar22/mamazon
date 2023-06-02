const mongoose = require('mongoose');

var productSchema = mongoose.Schema({
  sellerid: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  prodname:String,
  image:{
    type:Array,
    default:[]
  },
  desc:String,
  price:Number,
  discount:{
    type:Number,
    default:0
  }
})



module.exports = mongoose.model('products', productSchema);