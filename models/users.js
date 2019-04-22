var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose'); 

var Users = new Schema({
    avatar: String,
    email: {
        type: String,
    required: [true, 'Please enter an email'],
    unique: [true, 'Email must be unique']
    },
    username: {
        type: String,
    required: [true, 'Please enter a username'],
    unique: [true, 'Username must be unique']
    },
    first_name: String,
    last_name: String,
    admin: {
        type: Boolean,
        default: false
    },
    hash: {
        type: String,
        required: [
            true, 
            'There was a problem creating your password'
        ]
    },
    salt: {
        type: String,
        required: [
            true, 
            'There was a problem creating your password'
        ]
    },

});
//Added this for log-in
Users.pre('save', function(next){
    this.modified = new Date().toISOString();
    next();
  });  

Users.plugin(uniqueValidator);
Users.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', Users);