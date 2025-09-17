const express = require("express")
const { userAuth } = require("../middleware/userAuth")
const ConnectionRequest = require("../models/connectionRequest_model")
const User = require("../models/user_model")
const Chat = require("../models/chat_model")
const router = express.Router()

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
       try {
        const fromUserId = req.user._id
        const { toUserId } = req.params
        const { status } = req.params

        const allowedStatus = ["interested", "ignored"]
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                "message": "Invalid status type " + status
            })
        }

        // if there is an existing connection already then it should not re-connect
        const existingConnectionRequest = await ConnectionRequest.findOne(
        {
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId}
          ]
        })

        if(existingConnectionRequest){
            return res.status(400).send({ 
                message: "connection already exists"
             })
        }


        const toUser = await User.findById(toUserId);
        if (!toUser) 
        {return res.status(404).json({ message: "User not found!" })}
        
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
          message:
            req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
        
       } catch (error) {
          console.log(error);
       }
})

// on receiver end

router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
       try {
        const loggedInUser = req.user
        const { status, requestId } = req.params

        const allowedStatus = ['accepted', 'rejected']
        if(!allowedStatus.includes(status)){
          return res.status(400).json({ message: "This status is not allowed" })
        }
        
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId: loggedInUser._id,
            status:'interested'
        })

        if(!connectionRequest){
            return res.status(404).send("No connection request found")
        }

        if(connectionRequest.status === status){
           return res.status(400).send({ message: "Request is already accepted" })
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()

        res.json({ message: "Connection Request " + status, data })

       } catch (error) {
          console.log(error);
          res.status(400).send(error.message, "error is from catch block")
       }
})

// find all connection request which are "accepted" && they dont exist in chat collection

// GET /allConnections
router.get("/connectionsWithoutChat", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Step 1: find all accepted connections involving loggedInUser
    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    })
      .populate("fromUserId", "firstName lastName photoUrl about")
      .populate("toUserId", "firstName lastName photoUrl about")
      .lean();

    // Step 2: find all chats involving loggedInUser
    const existingChats = await Chat.find({
      participants: loggedInUserId
    }).lean();

    const existingPairs = new Set(
      existingChats.map(chat => {
        // for 1:1 chats: pick the "other user"
        if (chat.participants.length === 2) {
          return chat.participants.find(
            p => p.toString() !== loggedInUserId.toString()
          )?.toString();
        }
        return null;
      }).filter(Boolean)
    );

    // Step 3: filter connections where chat does not exist
    const filteredConnections = connections
      .map(conn => {
        // get other user
        const otherUser =
          conn.fromUserId._id.toString() === loggedInUserId.toString()
            ? conn.toUserId
            : conn.fromUserId;

        // exclude if chat already exists
        if (existingPairs.has(otherUser._id.toString())) return null;

        return {
          _id: conn._id, // connection id
          user: otherUser, // populated user details
          createdAt: conn.createdAt,
        };
      })
      .filter(Boolean);

    res.status(200).json(filteredConnections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router
