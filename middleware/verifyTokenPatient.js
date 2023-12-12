function checkPatientRole(req, res, next) {
  const userRole = req.user.role;

  if (userRole === "patient") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Unauthorized, only patient can do this changes" });
  }
}

module.exports = checkPatientRole;
