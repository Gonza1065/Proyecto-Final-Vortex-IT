const express = require("express");
const router = express.Router();

const specialtyController = require("../controllers/specialty-controller");

const authenticateToken = require("../middleware/authenticateToken");
const verifyTokenPatient = require("../middleware/verifyTokenPatient");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");

router.use(authenticateToken);

router.get("/", verifyTokenPatient, specialtyController.getSpecialty);
router.post(
  "/add-specialty",
  verifyTokenAdmin,
  specialtyController.addSpecialty
);

module.exports = router;
