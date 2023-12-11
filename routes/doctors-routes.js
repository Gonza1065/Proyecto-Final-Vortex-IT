const express = require("express");
const router = express.Router();

const doctorsController = require("../controllers/doctors-controller");

router.get("/doctors", doctorsController.getDoctors);
router.get("/doctor/:id", doctorsController.getDoctorSeeDetails);
router.post("/add-doctor", doctorsController.addDoctor);
router.patch("/update-doctor", doctorsController.updateDoctor);

module.exports = router;
