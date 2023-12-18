function checkPatientRole(req, res, next) {
  const userRole = req.user.role;

  if (userRole === "patient") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized, only patient can access this URL" });
  }
}

module.exports = checkPatientRole;
