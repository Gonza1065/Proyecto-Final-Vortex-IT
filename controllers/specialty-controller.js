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
      return res.status(404).json({ message: "Specialties not found" });
    }
    return res.status(200).json(existingSpecialty);
  } catch (err) {
    return res.status(500).json({ message: "Error server get specialty" });
  }
};

exports.getSpecialty = getSpecialty;
