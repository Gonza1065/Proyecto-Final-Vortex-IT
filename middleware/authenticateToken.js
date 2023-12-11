const jwt = require("jsonwebtoken");
const config = require("../config/config");

function authenticateToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso no autorizado. Token no proporcionado." });
  }

  jwt.verify(token, config.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token no válido." });
    }

    req.user = user; // Almacena la información del usuario en req.user
    next();
  });
}

module.exports = authenticateToken;
