const express = require("express");
const router = express.Router();

const doctorsController = require("../controllers/doctors-controller");

const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");
const verifyTokenPatient = require("../middleware/verifyTokenPatient");
const authenticateToken = require("../middleware/authenticateToken");

router.use(authenticateToken);

router.get("/", verifyTokenPatient, doctorsController.getDoctors);
router.get("/:id", verifyTokenPatient, doctorsController.getDoctorSeeDetails);
router.post("/add-doctor", verifyTokenAdmin, doctorsController.addDoctor);
router.patch(
  "/update-doctor/:id",
  verifyTokenAdmin,
  doctorsController.updateDoctor
);

module.exports = router;
