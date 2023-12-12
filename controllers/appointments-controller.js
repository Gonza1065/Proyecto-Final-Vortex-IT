const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const addAppointment = async (req, res, next) => {
  const { doctor, patient, date, status } = req.body;

  try {
    const existingAppointment = await Appointment.findOne({ date: date });
    if (existingAppointment) {
      return res
        .status(409)
        .json({ message: "Appointment already registered" });
    }
    const newAppointment = new Appointment({
      doctor,
      date,
      status: status || "available"
    });
    await newAppointment.save();
    await Doctor.findByIdAndUpdate(doctor, {
      $push: { appointments: newAppointment._id },
    });
    await User.findByIdAndUpdate(patient, {
      $push: { appointments: newAppointment._id },
    });
    return res.status(201).json({ message: "Appointment created" });
  } catch (err) {
    console.log(err);
  }
};
const updateAppointment = (req, res, next) => {};
const deleteAppointment = (req, res, next) => {};
const getAppointmentsByDoctor = (req, res, next) => {};
const getAppointmentsByPatient = (req, res, next) => {};
const reserveAppointment = async (req, res, next) => {
  const { userId, appointmentId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "patient") {
      return res.status(403).json({
        message: "Unauthorized. Only patients can reserve appointments.",
      });
    }
    const updatedAppointment = {
      status: "reserved",
      patient: userId,
    };
    await Appointment.findByIdAndUpdate(appointmentId, updatedAppointment);
    await User.findByIdAndUpdate(userId, {
      $push: { appointments: appointmentId },
    });

    return res
      .status(200)
      .json({ message: "Appointment reserved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error reserving appointment" });
  }
};
const cancelAppointment = (req, res, next) => {};
const allCancelations = (req, res, next) => {};

exports.addAppointment = addAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
exports.getAppointmentsByDoctor = getAppointmentsByDoctor;
exports.getAppointmentsByPatient = getAppointmentsByPatient;
exports.reserveAppointment = reserveAppointment;
exports.cancelAppointment = cancelAppointment;
exports.allCancelations = allCancelations;
