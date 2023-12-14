const Specialty = require("../models/Specialty");

// http://localhost:5000/api/specialty/
const getSpecialty = async (req, res, next) => {
  try {
    const existingSpecialty = await Specialty.find();
    if (!existingSpecialty) {
      return res
        .status(404)
        .json({ message: "There aren't specialities published" });
    }
    return res.status(200).json(existingSpecialty);
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/add-specialty
const addSpecialty = async (req, res, next) => {
  const { specialty } = req.body;
  const existingSpecialty = await Specialty.findOne({ specialty: specialty });
  if (existingSpecialty) {
    return res.status(409).json({ message: "Specialty already exists" });
  }
  const newSpecialty = new Specialty({
    specialty,
  });
  await newSpecialty.save();
  return res.status(201).json(newSpecialty);
};

exports.getSpecialty = getSpecialty;
exports.addSpecialty = addSpecialty;
