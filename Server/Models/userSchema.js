const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Name is requierd!']
    },

    email:{
        type: String,
        required: [true, 'Email is requierd!'],
        unikue: true
    },

    password:{
        type: String,
        required: [true, 'Password is requierd!']
    },

    date:Date

});

module.exports = mongoose.model('userSchemas', userSchema)