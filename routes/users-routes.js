const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");

router.post("/signup", usersController.signup);
router.post("/login", usersController.login);
router.post("/forgot-password", usersController.forgotPassword);
router.post("/reset-password/:token", usersController.resetPassword);

module.exports = router;
