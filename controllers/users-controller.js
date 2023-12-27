const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const config = require("../config/config");

const generateToken = require("../token/generateToken");

// http://localhost:5000/api/users/patients?page=1&limit=5
const getUsersPatient = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const existingUsersPatients = await User.find({ role: "patient" })
      .skip((page - 1) * limit)
      .limit(limit);
    if (existingUsersPatients.length === 0) {
      return res
        .status(404)
        .json({ message: "There aren't patients registered in the data base" });
    }
    return res.status(200).json(existingUsersPatients);
  } catch (err) {
    console.log(err);
  }
};

// http://localhost:5000/api/users/signup
const signup = async (req, res, next) => {
  const { name, lastName, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "Already exists user" });
    }
    const newUser = new User({
      name,
      lastName,
      email,
      password,
      role: role || "patient",
    });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ message: "Error at create the user" });
  }
};

// http://localhost:5000/api/users/login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Credentials invalid, verify your fields" });
    }
    const isPasswordValid = await existingUser.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(409)
        .json({ message: "Password incorrect, please check it" });
    }
    const token = generateToken(existingUser);
    return res.status(200).json({ existingUser, token });
  } catch (err) {
    return res.status(500).json({ message: "Error server at the logging" });
  }
};

// http://localhost:5000/api/users/forgot-password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = generateToken(existingUser);
    existingUser.resetToken = resetToken;
    existingUser.resetTokenExpiration = Date.now() + 3600000;
    await existingUser.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saguasg@gmail.com",
        pass: "xzqx zsin ftoo lpbe",
      },
    });
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
      from: "saguasg@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `Push here for reset to password: <a href="${resetLink}">${resetLink}</a>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Reset link sent successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error server at generate the link for reset password",
    });
  }
};

// http://localhost:5000/api/users/reset-password/:token
const resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, config.secret);
  const { newPassword, repeatNewPassword } = req.body;
  try {
    const user = await User.findOne({
      _id: decoded.id,
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (newPassword !== repeatNewPassword) {
      return res.status(409).json({ message: "The passwords have to match" });
    }
    user.password = await user.encryptPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error reseting password" });
  }
};

exports.getUsersPatient = getUsersPatient;
exports.signup = signup;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
