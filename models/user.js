const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    phone: {type:Number},
    role: {type:String, enum:['customer', 'admin', 'seller'], default:'customer'},
    profilePicture: {type:String, default: ''},
    address:{street: String, city: String, state: String, pincode: String},
    isVerified: {type: Boolean, default: false}
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema, 'users')