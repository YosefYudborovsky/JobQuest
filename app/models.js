'use strict';

// I put the mongoose connections here so I could
// access the mongoose connecton and initialize autoIncrement
// I will be changing this later
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connection = mongoose.createConnection('mongodb://localhost:27017/jobquest'); 
mongoose.connect('mongodb://localhost:27017/jobquest');
var shortId = require('shortid');

var PostSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  thread: {
    type:String,
    required:true
  },
  author: {
    type:String,
    default:'Anonymous',
    required:true
  },
  votes: {
    type:Number,
    default:0,
    required:true
  },
  created_at: {
    type:Date,
    required:true
  },
  comments:[{text:String, date:Date}]
});

var ApplicationSchema = new Schema({

  _id: {
    type:String,
    'default':shortId.generate
 },

  company: {
    type:String,
    required:true
  },
  role: {
    type:String,
    required:true
  },
  status: {
    type:String,
    required:true
  },
  comment: {
    type:String,
    required:false
  },
  created_at: {
    type:Date,
    default:Date.now,
    required:true
  }
});

module.exports = mongoose.model('Posts', PostSchema);
module.exports = connection.model('Applications', ApplicationSchema);

