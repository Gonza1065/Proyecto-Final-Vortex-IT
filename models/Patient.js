const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

patientSchema.methods.encryptPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

patientSchema.methods.comparePassword = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);
  return isPasswordValid;
};

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
