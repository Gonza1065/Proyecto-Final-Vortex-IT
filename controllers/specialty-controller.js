const Specialty = require("../models/Specialty");

// http://localhost:5000/api/specialty/
const getSpecialty = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const existingSpecialty = await Specialty.find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (!existingSpecialty) {
      return res
        .status(404)
        .json({ message: "There aren't specialities published" });
    }
    return res.status(200).json(existingSpecialty);
  } catch (err) {
    return res.status(500).json({ message: "Error server get specialty" });
  }
};

// http://localhost:5000/api/add-specialty
const addSpecialty = async (req, res, next) => {
  const { specialty } = req.body;
  try {
    const existingSpecialty = await Specialty.findOne({ specialty: specialty });
    if (existingSpecialty) {
      return res.status(409).json({ message: "Specialty already exists" });
    }
    const newSpecialty = new Specialty({
      specialty,
    });
    await newSpecialty.save();
    return res.status(201).json(newSpecialty);
  } catch (err) {
    return res.status(500).json({ message: "Error server add specialty" });
  }
};

exports.getSpecialty = getSpecialty;
exports.addSpecialty = addSpecialty;
