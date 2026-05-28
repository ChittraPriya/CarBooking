// models/driver.js
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  license: String,
  phone: String,
  status: {
  type: String,
  enum: ["Available", "On Trip"],
  default: "Available",
},
currentBooking: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Booking",
  default: null,
},
});

module.exports = mongoose.model("Driver", driverSchema, 'drivers');