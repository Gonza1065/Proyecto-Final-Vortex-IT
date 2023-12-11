const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, config.secret, {
    expiresIn: "1 day",
  });
};
module.exports = generateToken;
