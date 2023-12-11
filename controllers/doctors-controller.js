const Doctor = require("../models/Doctor");
const getDoctors = (req, res, next) => {};
const getDoctorSeeDetails = (req, res, next) => {};
const addDoctor = async (req, res, next) => {
  const { name, lastName, specialty } = req.body;

  try {
    const newDoctor = new Doctor({
      name,
      lastName,
      specialty,
    });
    await newDoctor.save();
    return res.status(201).json({ message: "Doctor created" });
  } catch (err) {
    console.log(err);
  }
};
const updateDoctor = (req, res, next) => {};

exports.getDoctors = getDoctors;
exports.getDoctorSeeDetails = getDoctorSeeDetails;
exports.addDoctor = addDoctor;
exports.updateDoctor = updateDoctor;
