const express = require("express");
const router = express.Router();

const specialtyController = require("../controllers/specialty-controller");

const authenticateToken = require("../middleware/authenticateToken");
const verifyTokenPatient = require("../middleware/verifyTokenPatient");

router.use(authenticateToken);

router.get("/", verifyTokenPatient, specialtyController.getSpecialty);

module.exports = router;
