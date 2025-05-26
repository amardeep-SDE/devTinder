const adminAuth = (req, res, next) => {
  console.log("Admin access attempt detected");

  const token = "xyz";
  const isAdminVerified = token === "xyz";

  if (!isAdminVerified) {
    res.send({
      error: "Unauthorized access",
      message: "You are not authorized to access this admin route",
    });
  } else {
    next();
  }
}

const userAuth = (req, res, next) => {
  console.log("Admin access attempt detected - user");

  const token = "xyz";
  const isAdminVerified = token === "xyz";

  if (!isAdminVerified) {
    res.send({
      error: "Unauthorized access",
      message: "You are not authorized to access this user route",
    });
  } else {
    next();
  }
}

module.exports = {
  adminAuth,
  userAuth
}