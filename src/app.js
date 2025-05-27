const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.post("/signup", async (req, res) => {
  try {
    const user = new User({
      firstName: "Sachin",
      lastName: "Tendulkar",
      emailId: "sachin@gmail.com",
      password: "sachin@123",
      age: 20,
      gender: "male",
    });
    await user.save();
    res.send({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// Connect to the database
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
