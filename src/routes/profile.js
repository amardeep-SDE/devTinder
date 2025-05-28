const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("User from auth middleware:", user);
    
    res.send({
      message: "Profile retrieved successfully",
      success: true,
      user
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

  // validateProfileEditData(req);
  try {
    if(!validateProfileEditData(req)) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    const loggedInUser = req.user;
    console.log("User from auth middleware:", loggedInUser);
    
    const updates = Object.keys(req.body);
    updates.forEach((update) => (loggedInUser[update] = req.body[update]));
    
    console.log("Updates to be applied:", req.body);
    
    await loggedInUser.save();
    
    res.send({
      message: "Profile updated successfully",
      success: true,
      user: loggedInUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).send({ error: "Bad Request", message: error.message });
  }
})

module.exports = profileRouter;