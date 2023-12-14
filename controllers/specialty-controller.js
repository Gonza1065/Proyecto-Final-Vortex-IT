const Doctor = require("../models/Doctor");

const getSpecialty = async (req, res, next) => {
  try {
    const specialityDoctors = await Doctor.find({}, "specialty");
    const specialityFounds = specialityDoctors.map(
      (doctor) => doctor.specialty
    );
    return res.status(200).json({ specialities: specialityFounds });
  } catch (err) {
    console.log(err);
  }
};

exports.getSpecialty = getSpecialty;
