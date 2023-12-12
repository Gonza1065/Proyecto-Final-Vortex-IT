const jwt = require("jsonwebtoken");
const config = require("../config/config");

function authenticateToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token no provided" });
  }
  jwt.verify(token, config.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token no valid." });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
