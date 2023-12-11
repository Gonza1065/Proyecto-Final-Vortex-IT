function checkAdminRole(req, res, next) {
  const userRole = req.user.role;

  if (userRole === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado. No tienes los permisos necesarios." });
  }
}

module.exports = checkAdminRole;
