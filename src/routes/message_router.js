const express = require("express")
const { userAuth } = require("../middleware/userAuth")
const router = express.Router()
const Chat = require("../models/chat_model");
const Message = require("../models/message_model");

router.get("/messages/:chatId", userAuth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const loggedInUserId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: loggedInUserId
    });

    if (!chat) {
      return res.status(403).send({ error: "Not authorized to view messages" });
    }

    // Fetch messages for this chat
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 });

    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch messages" });
  }
});

module.exports = router

