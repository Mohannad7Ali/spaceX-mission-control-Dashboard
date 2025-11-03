const mongoose = require('mongoose')
const launchesSchema = new mongoose.Schema({


  flightNumber : {
    type :Number,
    required:true
  } ,
  mission : {
    type :String,
    required:true
  } ,
  rocket : {
    type :String,
    required:true
  } ,
  launchDate : {
    type :Date,
    required:true
  },
  target : {
    type :String,
    required:true
  },
  upcoming : {
    type :Boolean,
    default:true
  },
  success : {
    type :Boolean,
    default:true
  },

  customers : [String]

})
const Launches = mongoose.model('Launch' , launchesSchema) ;
module.exports = Launches ;