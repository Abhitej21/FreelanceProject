const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {type: String,required: true,unique: true},
    username: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    confirm: {type: String,required: true},
    profileUrl: {type: String,required: true},
},{timestamps: true})

const SignUp = mongoose.model('SignUp',UserSchema)

module.exports = SignUp