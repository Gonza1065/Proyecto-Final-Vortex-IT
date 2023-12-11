const express = require("express");
const router = express.Router();

const patientsController = require("../controllers/patients-controller");

router.post("/signup", patientsController.signup);
router.post("/login", patientsController.login);

module.exports = router;
