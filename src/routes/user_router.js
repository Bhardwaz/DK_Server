const express = require("express")
const router = express.Router()
const { userAuth } = require("../middleware/userAuth")
const ConnectionRequest = require("../models/connectionRequest_model")
const User = require("../models/user_model")

router.get("/user/connections", userAuth, async (req, res) => {
     try {
        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", ["firstName", "lastName", "about"])
        .populate("toUserId", ["firstName", "lastName", "about"])

        const data = connectionRequest.map(row => {
            if(row.fromUserId !== loggedInUser._id) return row.fromUserId
            return row.toUserId
        })

        return res.status(200).send({
            data,
            message:"success"
        })

     } catch (error) {
        console.log(error);
        return res.status(200).send(error.message)
     }
})

router.get("/user/feed", userAuth, async (req, res) => {
      try {
        const currentUserId = req.user._id
         
        // getting loggedin user info
        const loggedInUser = await User.findById(currentUserId)
        const preferences = loggedInUser.interestIn;

        // finding all users involved in connection requests
        const connectionRequests = await ConnectionRequest.find({
           $or: [
               { fromUserId: currentUserId },
               { toUserId: currentUserId, status: { $in: ['accepted', 'rejected'] } },
            ]});
        
        const excludedUserIds = new Set();

        connectionRequests.forEach((req) => {
          if (req.fromUserId.toString() === currentUserId.toString()) {
              excludedUserIds.add(req.toUserId.toString());
          } else {
        excludedUserIds.add(req.fromUserId.toString());
       }});

       excludedUserIds.add(currentUserId.toString()); // Exclude self

        // find feed users
       const feedUsers = await User.find({
            _id: { $nin: Array.from(excludedUserIds) },
            gender: { $in: preferences },
        }).limit(20);

        res.json(feedUsers);
    } catch (error) {
        console.log(error);
         res.status(500).json({ error: 'Failed to load feed. coming over there' });
      }
})

module.exports = router