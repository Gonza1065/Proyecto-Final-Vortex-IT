const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const getDoctors = async (req, res, next) => {
  try {
    const existingDoctors = await Doctor.find().populate("appointments");
    if (existingDoctors.length <= 0) {
      return res
        .status(409)
        .json({ message: "There aren't doctors in the system" });
    }

    return res.status(200).json(existingDoctors);
  } catch (err) {
    console.log(err);
  }
};
const getDoctorSeeDetails = (req, res, next) => {};
const addDoctor = async (req, res, next) => {
  const { name, lastName, specialty, appointments } = req.body;

  try {
    const newDoctor = new Doctor({
      name,
      lastName,
      specialty,
    });
    await newDoctor.save();
    const doctorId = newDoctor._id;
    if (appointments && appointments.length > 0) {
      const appointmentsWithDoctor = appointments.map((appointment) => ({
        ...appointment,
        doctor: doctorId,
      }));
      await Appointment.create(appointmentsWithDoctor);
      newDoctor.appointments = appointmentsWithDoctor.map(
        (appointment) => appointment._id
      );
      await newDoctor.save();
    }

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
