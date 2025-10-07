const Chat = require("../../models/chat_model");
const ConnectionRequest = require("../../models/connectionRequest_model");

async function connectionsWithoutChat (req, res) {
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
}

module.exports = connectionsWithoutChat