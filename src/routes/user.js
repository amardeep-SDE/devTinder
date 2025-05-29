const express = require("express");

const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "skills"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;
    console.log("Logged in user ID:", loggedInUserId);

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    console.log("Received connection requests:", connectionRequests);

    if (!connectionRequests || connectionRequests.length === 0) {
      return res.status(404).json({ message: "No received requests found." });
    }

    res.status(200).json(connectionRequests);
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      } else {
        return request.fromUserId;
      }
    });
    // console.log("Connections:", data);
    res.json({ data });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50 : limit; // Limit to a maximum of 50 users per request
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.toUserId.toString());
      hideUsersFromFeed.add(request.fromUserId.toString());
    });
    // if (request.fromUserId.toString() === loggedInUser._id.toString()) {
    //     hideUsersFromFeed.add(request.toUserId.toString());
    // } else {
    //     hideUsersFromFeed.add(request.fromUserId.toString());
    // }
    // });

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
      ],
    }).select(USER_SAFE_DATA).limit(limit).skip(skip);

    console.log("Users:", users);
    res.json({ users });
  } catch (error) {
    console.error("Error fetching user feed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = userRouter;
