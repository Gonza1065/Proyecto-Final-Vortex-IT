const User = require("../models/User");

const generateToken = require("../token/generateToken");

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
    console.log(err);
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
    console.log(err);
  }
};

exports.signup = signup;
exports.login = login;
