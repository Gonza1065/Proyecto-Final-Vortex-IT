const Patient = require("../models/Patient");
const generateToken = require("../token/generateToken");
const signup = async (req, res, next) => {
  const { name, lastName, email, password } = req.body;

  try {
    const existingPatient = await Patient.findOne({ email: email });
    if (existingPatient) {
      return res.status(409).json({ message: "Already exists patient" });
    }
    const newPatient = new Patient({
      name,
      lastName,
      email,
      password,
    });
    newPatient.password = await newPatient.encryptPassword(password);
    await newPatient.save();
    return res.status(201).json(newPatient);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error at create the patient" });
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingPatient = await Patient.findOne({ email: email });
    if (!existingPatient) {
      return res
        .status(404)
        .json({ message: "Credentials invalid, verify your fields" });
    }
    const isPasswordValid = await existingPatient.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(409)
        .json({ message: "Password incorrect, please check it" });
    }
    const token = generateToken(existingPatient);
    return res.status(200).json({ existingPatient, token });
  } catch (err) {
    console.log(err);
  }
};

exports.signup = signup;
exports.login = login;
