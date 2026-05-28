const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: String,

    code: {
      type: String,
      unique: true,
    },

    desc: String,

    type: {
      type: String,
      enum: ["bank", "seasonal", "all"],
      default: "all",
    },

    img: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Offer",
  offerSchema
);