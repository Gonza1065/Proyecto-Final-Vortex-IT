const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Specialty = require("../models/Specialty");

// http://localhost:5000/api/doctors/
const getDoctors = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const existingDoctors = await Doctor.find()
      .populate("specialty")
      .select("name lastName specialty")
      .skip((page - 1) * limit)
      .limit(limit);
    if (existingDoctors.length === 0) {
      return res
        .status(409)
        .json({ message: "There aren't doctors in the system" });
    }
    return res.status(200).json(existingDoctors);
  } catch (err) {
    return res.status(500).json({ message: "Error server get doctors" });
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
        populate: {
          path: "specialty",
          select: "specialty",
        },
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
    return res
      .status(500)
      .json({ message: "Error internal for see details of the doctor" });
  }
};

// http://localhost:5000/api/doctors/add-doctor
const addDoctor = async (req, res, next) => {
  const { name, lastName, specialty, appointments } = req.body;
  try {
    let existingSpecialty = await Specialty.findOne({ specialty });
    if (!existingSpecialty) {
      existingSpecialty = await Specialty.create({ specialty });
    }
    const idSpecialty = existingSpecialty._id;
    const specialtyDoctorFound = await Doctor.findOne({
      specialty: idSpecialty,
    });
    if (specialtyDoctorFound) {
      return res
        .status(409)
        .json({ message: "Already exists a doctor with that specialty" });
    }
    const newDoctor = new Doctor({
      name,
      lastName,
      specialty: idSpecialty,
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
    return res
      .status(500)
      .json({ message: "Error server add doctor at system" });
  }
};

// http://localhost:5000/api/doctors/update-doctor/:id
const updateDoctor = async (req, res, next) => {
  const doctorId = req.params.id;
  const { name, lastName, specialty } = req.body;
  try {
    const existingDoctor = await Doctor.findById(doctorId);
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found for update it" });
    }
    const existingSpecialty = existingDoctor.specialty;
    if (existingSpecialty.toString() !== specialty.toString()) {
      let foundSpecialty = await Specialty.findOne({ specialty });
      if (!foundSpecialty) {
        foundSpecialty = await Specialty.create({ specialty });
      }
      await Doctor.findByIdAndUpdate(doctorId, {
        specialty: foundSpecialty._id,
      });
    }
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { name, lastName, specialty },
      {
        new: true,
      }
    );
    return res.status(201).json(updatedDoctor);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error server update the doctor" });
  }
};

exports.getDoctors = getDoctors;
exports.getDoctorSeeDetails = getDoctorSeeDetails;
exports.addDoctor = addDoctor;
exports.updateDoctor = updateDoctor;
