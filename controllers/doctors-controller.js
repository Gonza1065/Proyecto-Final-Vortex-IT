const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// http://localhost:5000/api/doctors/
const getDoctors = async (req, res, next) => {
  try {
    const existingDoctors = await Doctor.find()
      .populate("specialty")
      .select("name lastName specialty");
    if (existingDoctors.length === 0) {
      return res
        .status(409)
        .json({ message: "There aren't doctors in the system" });
    }

    return res.status(200).json(existingDoctors);
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/doctors/:id
const getDoctorSeeDetails = async (req, res, next) => {
  const doctorId = req.params.id;
  try {
    const existingDoctor = await Doctor.findById(doctorId).populate({
      path: "appointments",
      populate: {
        path: "doctor",
        select: "name lastName specialty",
      },
    });
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found for see details" });
    }
    if (existingDoctor.appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "There aren't appointments published" });
    }
    const appointmentsAvailable = existingDoctor.appointments.filter(
      (appointment) => appointment.status === "available"
    );
    if (appointmentsAvailable.length === 0) {
      return res.status(404).json({
        message: "There aren't appointments available, full reserved",
      });
    }
    return res.status(200).json(appointmentsAvailable);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error internal for see details" });
  }
};

// http://localhost:5000/api/doctors/add-doctor
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

// http://localhost:5000/api/doctors/update-doctor/:id
const updateDoctor = async (req, res, next) => {
  const doctorId = req.params.id;
  const updateData = req.body;
  try {
    const existingDoctor = await Doctor.findById(doctorId);
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found for update it" });
    }
    await Doctor.findByIdAndUpdate(doctorId, updateData);
    return res.status(201).json({ message: "Doctor updated" });
  } catch (err) {
    console.log(err);
  }
};

exports.getDoctors = getDoctors;
exports.getDoctorSeeDetails = getDoctorSeeDetails;
exports.addDoctor = addDoctor;
exports.updateDoctor = updateDoctor;
