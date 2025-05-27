const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { valiDateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log("Received login data:", req.body);

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {

      const token = await jwt.sign({_id: user._id}, "secretKey")
      console.log("Generated Token:", token);

      res.cookie("token", token)
      res.status(200).send({
        message: "Login successful",
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


app.get("/profile", async (req, res) => {
  try {
   

    const cookies = req.cookies;
    // console.log("Cookies:", cookies);

    const {token} = cookies;

     if (!token) {
      return res.status(401).send({ error: "Unauthorized access" });
    } 
    const decodedToken = jwt.verify(token, "secretKey");
    // console.log("Decoded Token:", decodedToken);

    const { _id } = decodedToken;
    // console.log("User ID from token:", _id);

   
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // const user = await User.findOne({ emailId: emailId });
    // console.log("User found:", user);
    // if (!user) {
    //   return res.status(404).send({ error: "User not found" });
    // }

    res.send({
      message: "Profile retrieved successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).send({ error: "Internal Server Error" });
  } 
});


app.get("/users", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.find({ emailId: userEmail });
    res.send({
      message: "Users retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send({
      message: "Users retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.patch("/userUpdate/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const allowedUpdates = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    const isValidOperation = Object.keys(updateData).every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    if (updateData?.skills.length > 5) {
      // return res.status(400).send({ error: "Skills array cannot exceed 5 items.", message: error.message });
      throw new Error("Skills array cannot exceed 5 items.");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    await user.save();
    res.send({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .send({ error: "Something went wrong", message: error.message });
  }
});

app.delete("/userDelete", async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("Deleting user with email:", userId);

    const user = await User.findByIdAndDelete({ _id: userId });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Removed duplicate "/users" GET route with syntax error
// Connect to the database
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
