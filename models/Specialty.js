const mongoose = require("mongoose");

const specialtySchema = new mongoose.Schema({
  specialty: {
    type: String,
    unique: true, // Asegura que los nombres de especialidad sean únicos
    required: true,
  },
});

const Specialty = mongoose.model("Specialty", specialtySchema);

module.exports = Specialty;
