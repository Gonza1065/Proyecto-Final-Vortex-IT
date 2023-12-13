const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

const addAppointment = async (req, res, next) => {
  const { doctor, date, status } = req.body;
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
      status: status || "available",
    });
    await newAppointment.save();
    await Doctor.findByIdAndUpdate(doctor, {
      $push: { appointments: newAppointment._id },
    });
    return res.status(201).json({ message: "Appointment created" });
  } catch (err) {
    console.log(err);
  }
};

const updateAppointment = async (req, res, next) => {
  const appointmentId = req.params.id;
  const updateData = req.body;
  try {
    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment no exists" });
    }
    await Appointment.findByIdAndUpdate(appointmentId, updateData);
    return res.status(201).json({ message: "Appointment actualized" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error at update the appointment" });
  }
};

const deleteAppointment = async (req, res, next) => {
  const appointmentId = req.params.id;
  try {
    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found for delete it" });
    }
    const doctorId = existingAppointment.doctor;
    const patientId = existingAppointment.patient;
    await Appointment.findByIdAndDelete(appointmentId);
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { appointments: appointmentId },
    });
    if (patientId) {
      await User.findByIdAndUpdate(patientId, {
        $pull: { appointments: appointmentId },
      });
    }
    return res.status(201).json({ message: "Appointment deleted" });
  } catch (err) {
    console.log(err);
  }
};

const getAppointmentsByDoctor = async (req, res, next) => {
  const doctorId = req.params.id;
  try {
    const appointmentByDoctor = await Appointment.find({
      doctor: doctorId,
    }).populate("doctor");
    if (!appointmentByDoctor) {
      return res
        .status(404)
        .json({ message: "There aren't appointments with that doctor" });
    }
    return res.status(200).json(appointmentByDoctor);
  } catch (err) {
    console.log(err);
  }
};

const getAppointmentsByPatient = async (req, res, next) => {
  const patientId = req.params.id;
  try {
    const appointmentByPatient = await Appointment.find({
      patient: patientId,
    }).populate("patient");
    if (!appointmentByPatient || appointmentByPatient.length === 0) {
      return res
        .status(404)
        .json({ message: "There aren't appointments with that patient" });
    }
    return res.status(200).json(appointmentByPatient);
  } catch (err) {
    console.log(err);
  }
};

const reserveAppointment = async (req, res, next) => {
  const { userId, appointmentId } = req.body;
  try {
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

const allCancelationsByPatient = (req, res, next) => {};

exports.addAppointment = addAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
exports.getAppointmentsByDoctor = getAppointmentsByDoctor;
exports.getAppointmentsByPatient = getAppointmentsByPatient;
exports.reserveAppointment = reserveAppointment;
exports.cancelAppointment = cancelAppointment;
exports.allCancelationsByPatient = allCancelationsByPatient;
