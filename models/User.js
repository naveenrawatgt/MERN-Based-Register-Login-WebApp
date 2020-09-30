const mongoose = require('mongoose');
const { Passport } = require('passport');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    creationDate:{
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;