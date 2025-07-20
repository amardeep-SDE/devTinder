const jwt = require("jsonwebtoken");
const User = require("../models/user");
 const userAuth = async (req, res, next) => {
  try {
    const {token} = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User Unauthorized",
      });
    }
    // verify the token
    const decoded = await jwt.verify(token, "secretKey");

    const { _id } = decoded;

    const user = await User.findById(_id);
    // check decoded token
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
     req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = { userAuth };