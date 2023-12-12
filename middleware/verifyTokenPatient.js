function checkPatientRole(req, res, next) {
  const userRole = req.user.role;

  if (userRole === "patient") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado. No tienes los permisos necesarios." });
  }
}

module.exports = checkPatientRole;
