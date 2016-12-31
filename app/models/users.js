//model users 
var mongoose = require('mongoose');                     // mongoose for mongodb
module.exports = mongoose.model('users', {
        username : String,
        email : String,
        password : String,
        name : String ,
        age : Number,
        biography : String,
        image : String
    });