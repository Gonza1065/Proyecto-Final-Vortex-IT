const express = require("express");
const router = express.Router();

const doctorsController = require("../controllers/doctors-controller");
const checkAdminRole = require("../middleware/verifyTokenAdmin");
const authenticateToken = require("../middleware/authenticateToken");

router.use(authenticateToken);

router.get("/doctors", doctorsController.getDoctors);
router.get("/doctor/:id", doctorsController.getDoctorSeeDetails);
router.post("/add-doctor", checkAdminRole, doctorsController.addDoctor);
router.patch("/update-doctor", doctorsController.updateDoctor);

module.exports = router;
