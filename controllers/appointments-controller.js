const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// http://localhost:5000/api/appointment/add-appointment
const addAppointment = async (req, res, next) => {
  const { doctorId, date } = req.body;
  try {
    const existingAppointment = await Appointment.findOne({ date: date });
    if (existingAppointment) {
      return res
        .status(409)
        .json({ message: "Appointment already registered" });
    }
    const newAppointment = new Appointment({
      doctorId,
      date,
      status: "available",
    });
    await newAppointment.save();
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { appointments: newAppointment._id },
    });
    return res.status(201).json({ message: "Appointment created" });
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/appointment/update-appointment/:id
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

// http://localhost:5000/api/appointment/delete-appointment/:id
const deleteAppointment = async (req, res, next) => {
  const appointmentId = req.params.id;
  try {
    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found for delete it" });
    }
    const doctorId = existingAppointment.doctorId;
    await Appointment.findByIdAndDelete(appointmentId);
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { appointments: appointmentId },
    });
    return res.status(201).json({ message: "Appointment deleted" });
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/appointment/get-appointments-by-doctor/:id
const getAppointmentsByDoctor = async (req, res, next) => {
  const doctorId = req.params.id;
  try {
    const appointmentByDoctor = await Doctor.findById(doctorId).populate({
      path: "appointments",
      populate: [
        { path: "doctorId", select: "name lastName specialty" },
        { path: "patient", select: "name lastName email" },
      ],
    });
    if (!appointmentByDoctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found for see appointments" });
    }
    if (appointmentByDoctor.appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "There aren't appointments with this doctor" });
    }
    return res.status(200).json(appointmentByDoctor.appointments);
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/appointment/get-appointments-by-patients/:id
const getAppointmentsByPatient = async (req, res, next) => {
  const patientId = req.params.id;
  try {
    const appointmentByPatient = await Appointment.find({
      patient: patientId,
    })
      .populate({
        path: "patient",
        select: "name lastName",
      })
      .populate({
        path: "doctorId",
        select: "name lastName specialty",
        populate: {
          path: "specialty",
          select: "specialty",
        },
      });

    if (appointmentByPatient.length === 0) {
      return res
        .status(404)
        .json({ message: "There aren't appointments with that patient" });
    }
    return res.status(200).json(appointmentByPatient);
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/appointment/reserve-appointment
const reserveAppointment = async (req, res, next) => {
  const { userId, appointmentId } = req.body;
  try {
    const updatedAppointment = {
      status: "reserved",
      patient: userId,
    };
    const appointmentReserved = await Appointment.findByIdAndUpdate(
      appointmentId,
      updatedAppointment,
      { new: true }
    );
    return res.status(200).json(appointmentReserved);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error reserving appointment" });
  }
};

// http://localhost:5000/api/appointment/cancel-appointment
const cancelAppointment = async (req, res, next) => {
  const { userId, appointmentId } = req.body;
  try {
    const appointmentFound = await Appointment.findById(appointmentId);
    if (!appointmentFound) {
      return res
        .status(404)
        .json({ message: "Appointment not found for cancel it" });
    }
    if (appointmentFound.status === "available") {
      return res
        .status(409)
        .json({ message: "Cannot cancel a appointment when available" });
    }
    const doctorId = appointmentFound.doctorId;
    const updatedAppointment = {
      status: "cancelled",
      patient: userId,
    };
    const canceledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updatedAppointment,
      { new: true }
    );
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { appointments: appointmentId },
    });
    return res.status(200).json(canceledAppointment);
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/appointment/all-cancelations-by-patient/:id
const allCancelationsByPatient = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found for see all cancelations" });
    }
    const cancelations = await Appointment.find({
      $and: [{ patient: userId }, { status: "cancelled" }],
    })
      .populate({
        path: "doctorId",
        select: "name lastName specialty",
      })
      .populate({
        path: "patient",
        select: "name lastName",
      });
    return res.status(200).json(cancelations);
  } catch (err) {
    console.log(err);
  }
};

exports.addAppointment = addAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
exports.getAppointmentsByDoctor = getAppointmentsByDoctor;
exports.getAppointmentsByPatient = getAppointmentsByPatient;
exports.reserveAppointment = reserveAppointment;
exports.cancelAppointment = cancelAppointment;
exports.allCancelationsByPatient = allCancelationsByPatient;
