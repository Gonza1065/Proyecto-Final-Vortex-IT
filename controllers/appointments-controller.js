const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// http://localhost:5000/api/appointment/add-appointment
const addAppointment = async (req, res, next) => {
  const { doctor, date } = req.body;
  try {
    const allowedStartHour = "08:00";
    const allowedEndHour = "20:00";
    if (date < allowedStartHour || date > allowedEndHour) {
      return res.status(409).json({
        message:
          "Couldn't publish the appointment because it is outside the schedule range. It has to be between 08:00 and 20:00",
      });
    }
    const existingAppointment = await Appointment.findOne({ date: date });
    if (existingAppointment) {
      return res
        .status(409)
        .json({ message: "Appointment already registered" });
    }
    const newAppointment = new Appointment({
      doctor,
      date,
      status: "available",
    });
    await newAppointment.save();
    await Doctor.findByIdAndUpdate(doctor, {
      $push: { appointments: newAppointment._id },
    });
    return res.status(201).json(newAppointment);
  } catch (err) {
    return res.status(500).json({ message: "Error server add appointment" });
  }
};

// http://localhost:5000/api/appointment/update-appointment/:id
const updateAppointment = async (req, res, next) => {
  const appointmentId = req.params.id;
  const { date } = req.body;
  try {
    const allowedStartHour = "08:00";
    const allowedEndHour = "20:00";
    if (date < allowedStartHour || date > allowedEndHour) {
      return res.status(409).json({
        message:
          "Couldn't publish the appointment because it is outside the schedule range. It has to be between 08:00 and 20:00",
      });
    }
    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment no exists" });
    }
    if (
      existingAppointment.status === "reserved" ||
      existingAppointment.status === "cancelled"
    ) {
      return res
        .status(409)
        .json({ message: "Couldn't update because don't is available" });
    }
    const appointmentUpdated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date },
      { new: true }
    );
    return res.status(201).json(appointmentUpdated);
  } catch (err) {
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
    if (
      existingAppointment.status === "cancelled" ||
      existingAppointment.status === "reserved"
    ) {
      return res
        .status(409)
        .json({ message: "Couldn't delete because don't is available" });
    }
    const doctorId = existingAppointment.doctorId;
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    );
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { appointments: appointmentId },
    });
    return res.status(201).json(deletedAppointment);
  } catch (err) {
    return res.status(500).json({ message: "Error server delete appointment" });
  }
};

// http://localhost:5000/api/appointment/get-appointments-by-doctor/:id
const getAppointmentsByDoctor = async (req, res, next) => {
  const doctorId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const appointmentByDoctor = await Doctor.findById(doctorId).populate({
      path: "appointments",
      populate: [
        {
          path: "doctor",
          select: "name lastName specialty",
          populate: { path: "specialty", select: "specialty" },
        },
        { path: "patient", select: "name lastName" },
      ],
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
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
    return res
      .status(500)
      .json({ message: "Error server get appointments by doctor" });
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
        path: "doctor",
        select: "name lastName specialty",
        populate: {
          path: "specialty",
          select: "specialty",
        },
      });
    if (!appointmentByPatient) {
      return res
        .status(404)
        .json({ message: "Appointments by patient not found" });
    }
    if (appointmentByPatient.length === 0) {
      return res
        .status(404)
        .json({ message: "There aren't appointments with that patient" });
    }
    return res.status(200).json(appointmentByPatient);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error server error get appointments by patient" });
  }
};

// http://localhost:5000/api/appointment/reserve-appointment
const reserveAppointment = async (req, res, next) => {
  const { userId, appointmentId } = req.body;
  try {
    const appointmentFound = await Appointment.findById(appointmentId);
    const userFound = await User.findById(userId);
    if (!appointmentFound) {
      return res
        .status(404)
        .json({ message: "Appointment not found for reserve it" });
    }
    if (!userFound) {
      return res
        .status(404)
        .json({ message: "User not found for do the reserve" });
    }
    if (appointmentFound.status === "reserved") {
      return res.status(409).json({
        message: "Appointment already reserved, please choose another",
      });
    }
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
    return res.status(500).json({ message: "Error reserving appointment" });
  }
};

// http://localhost:5000/api/appointment/cancel-appointment
const cancelAppointment = async (req, res, next) => {
  const { userId, appointmentId } = req.body;
  try {
    const appointmentFound = await Appointment.findById(appointmentId);
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res
        .status(404)
        .json({ message: "User not found for cancel appointment" });
    }
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
    if (appointmentFound.status === "cancelled") {
      return res
        .status(409)
        .json({ message: "This appointment already cancelled" });
    }
    const doctorId = appointmentFound.doctor;
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
    return res.status(500).json({ message: "Error server cancel appointment" });
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
        path: "doctor",
        select: "name lastName specialty",
      })
      .populate({
        path: "patient",
        select: "name lastName",
      });
    return res.status(200).json(cancelations);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error server get all cancelations by patient" });
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
