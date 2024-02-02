const express = require("express");
const router = express.Router();

const specialtyController = require("../controllers/specialty-controller");

const authenticateToken = require("../middleware/authenticateToken");
const verifyTokenPatient = require("../middleware/verifyTokenPatient");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");

router.use(authenticateToken);

router.get("/", specialtyController.getSpecialty);
router.get("/:id", specialtyController.getSpecialtySeeDetails);
router.patch(
  "/update-specialty/:id",
  verifyTokenAdmin,
  specialtyController.updateSpecialty
);

module.exports = router;
