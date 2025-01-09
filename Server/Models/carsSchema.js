const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "userSchemas",
    required: [true, "User ID is required!"],
  },

  image: {
    type: String,
    required: [true, "Image is requierd!"],
  },
  typeCar: {
    type: String,
    required: [true, "TypeCar is requierd!"],
  },
  company:{
    type: String,
    required: [true, "company is requierd!"],
  },
  model: {
    type: String,
    required: [true, "Model is requierd!"],
  },

  color: {
    type: String,
    required: [true, "Color is requierd!"],
  },

  year:{
    type: Number,
    required: [true, "year is requierd!"],
  },
  price:{
    type: Number,
    required: [true, "price is requierd!"],
  },
  carNumber: {
    type: String,
    required: [true, "carNumber is requierd!"],
    unique: true,
  },
  kilometer: {
    type: Number,
    required: [true, "kilometer is requierd!"],
  },
  test: {
    type: Boolean,
  },
  dateTest: {
    type: Date,
    required: [true, "dateTest is requierd!"],
  },
  MOT: {
    type: Boolean,
  },
  dateMOT: {
    type: Date,
    required: [true, "dateMOT is requierd!"],
  },
  location: {
    type: String,
  },
  isWashed:{
    type:Boolean,
    default: true,

  },
  isMoved:{
    type:Boolean,
    default: true,

  },
  isReadyForRent:{
    type:Boolean,
    default: true,

  },
  isReturn:{
    type:Boolean,
    default: true,
  },
  isReadyToReturn:{
    type:Boolean,
    default: false,
  },
  

});

module.exports = mongoose.model("carSchemas", carSchema);
