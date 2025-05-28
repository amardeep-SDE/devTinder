const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      console.log("From User ID:", fromUserId);
      console.log("To User ID:", toUserId);
      

      const allowedStatuses = ["ignored", "interested", "accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({
            error:
              "Invalid status. Must be one of: ignored, interested, accepted, rejected.",
          });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ error: "User not found." });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ error: "Connection request already exists." });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.status(200).json({
        message: "Connection request sent successfully.",
        connectionRequest,
        errors: [{ message: "Connection request sent successfully." }],
      });
    } catch (error) {
      console.error("Error sending connection request:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

module.exports = requestRouter;
