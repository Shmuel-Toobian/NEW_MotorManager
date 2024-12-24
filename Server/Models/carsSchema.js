const mongoose = require("mongoose")

const carSchema = new mongoose.Schema({


    user: {
  type: mongoose.Types.ObjectId,
  ref: 'userSchemas',
  required: [true, 'User ID is required!']
},

    picture:{
        type: String,
        required: [true, 'Image is requierd!']
    },
    typeCar:{
        type: String,
        required: [true, 'TypeCar is requierd!']
    },
    model:{
        type: String,
        required: [true, 'Model is requierd!']
    },

    color:{
        type: String,
        required: [true, 'Color is requierd!']
    },

    carNumber:{
        type: String,
        required: [true, 'carNumber is requierd!'],
        unique: true
    },
    kilometer:{
        type:Number,
        required: [true, 'kilometer is requierd!'],
    },
    test:{
        type:Boolean,
    },
    dateTest:{
        type:Date,
        required: [true, 'dateTest is requierd!'],

    },
    MOT:{
        type:Boolean,
    },
    dateMOT:{
        type:Date,
        required: [true, 'dateMOT is requierd!']

    },


});

module.exports = mongoose.model('carSchemas', carSchema)