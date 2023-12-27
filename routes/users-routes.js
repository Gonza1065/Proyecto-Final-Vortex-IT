const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");

const authenticateToken = require("../middleware/authenticateToken");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");

router.get(
  "/patients",
  [authenticateToken, verifyTokenAdmin],
  usersController.getUsersPatient
);
router.post("/signup", usersController.signup);
router.post("/login", usersController.login);

router.post("/forgot-password", usersController.forgotPassword);
router.post("/reset-password/:token", usersController.resetPassword);

module.exports = router;
