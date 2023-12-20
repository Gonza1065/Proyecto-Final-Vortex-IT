const mongoose = require("mongoose");

const specialtySchema = new mongoose.Schema({
  specialty: {
    type: String,
    unique: true,
    required: true,
  },
});

const Specialty = mongoose.model("Specialty", specialtySchema);

module.exports = Specialty;
