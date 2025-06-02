const express = require('express');
const { valiDateSignupData } = require("../utils/validation.js");
const User = require("../models/user.js");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;
    console.log("Received signup data:", req.body);
    valiDateSignupData(req);

    if (req.body.skills && req.body.skills.length > 5) {
      // return res.status(400).send({ error: "Skills array cannot exceed 5 items." });
      throw new Error("Skills array cannot exceed 5 items.");
    }

    const hashPassword = await bcrypt.hash(password, 8);
    console.log("Hashed Password:", hashPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      photoUrl,
      about,
      skills: skills || [], // Default to an empty array if skills is not provided
    });
    await user.save();
    res.send({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res
      .status(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log("Received login data:", req.body);

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const isPasswordMatch = await user.validatePassword(password);
    if (isPasswordMatch) {
      const token = await user.getJWT();
      console.log("Generated Token:", token);

      res.cookie("token", token);
      res.status(200).send({
        message: "Login successfully",
        success: true,
        user,
      });
    } else {
      res.status(401).send({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
});

authRouter.post("/logout", async (req, res) => {
    // res.clearCookie("token"); or res.cookie("token", "");  
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res
      .status(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
});

module.exports = authRouter;