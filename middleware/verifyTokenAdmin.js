function checkAdminRole(req, res, next) {
  const userRole = req.user.role;

  if (userRole === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized, only admin can access this URL" });
  }
}

module.exports = checkAdminRole;
