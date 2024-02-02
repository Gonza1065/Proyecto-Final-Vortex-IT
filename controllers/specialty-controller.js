const Specialty = require("../models/Specialty");

// http://localhost:5000/api/specialty/
const getSpecialty = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const existingSpecialty = await Specialty.find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (!existingSpecialty || existingSpecialty.length === 0) {
      return res.status(404).json({ message: "Specialties not found" });
    }
    return res.status(200).json(existingSpecialty);
  } catch (err) {
    return res.status(500).json({ message: "Error server get specialty" });
  }
};

// http://localhost:5000/api/specialty/:id
const getSpecialtySeeDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const existingSpecialty = await Specialty.findById(id);
    if (!existingSpecialty) {
      return res
        .status(404)
        .json({ message: "Specialty not found for see details" });
    }
    return res.status(200).json(existingSpecialty);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error internal get specialty for see details" });
  }
};

// http://localhost:5000/api/specialty/update-specialty/:id
const updateSpecialty = async (req, res, next) => {
  const { id } = req.params;
  const { specialty } = req.body;
  try {
    const existingSpecialty = await Specialty.findById(id);
    if (!existingSpecialty) {
      return res
        .status(404)
        .json({ message: "Couldn't find the specialty for update it" });
    }
    const updatedSpecialty = await Specialty.findByIdAndUpdate(
      id,
      { specialty },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedSpecialty);
  } catch (err) {
    console.log(err);
  }
};

exports.getSpecialty = getSpecialty;
exports.updateSpecialty = updateSpecialty;
exports.getSpecialtySeeDetails = getSpecialtySeeDetails;
