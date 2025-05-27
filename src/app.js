const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const user = new User({
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
    });
    await user.save();
    res.send({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ error: "Internal Server Error" , message: error.message });
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

app.patch("/userUpdate", async (req, res) => {
  try {

    const userId = req.body.userId;
    const updateData = req.body;

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
    res.status(500).send({ error: "Something went wrong", message: error.message });
    
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
