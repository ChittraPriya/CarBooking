const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String }
}, { timestamps: true });

//prevent overwrite error
module.exports = mongoose.models.Branch || mongoose.model("Branch", branchSchema);