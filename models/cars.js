const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String },

  pricePerDay: { type: Number, required: true },

  description: { type: String },
  seats: { type: Number },

  image: { type: String },

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch"
  },
  fuelType: {
  type: String,
  enum: ["petrol", "diesel", "electric", "cng"],
  required: true,
},

  available: { type: Boolean, default: true }, 

}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema, 'cars');