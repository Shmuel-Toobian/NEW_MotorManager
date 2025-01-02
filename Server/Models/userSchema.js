const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    role:{
        type: String,
        enum: ['user', 'admin'],
        default: "user",
   },
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
    // phone:{
    //     type: Number,
    //     required: [true, 'Phone is requierd!']
    // },
    addres: {
        type: String,
      },

    date:Date

});

module.exports = mongoose.model('userSchemas', userSchema)