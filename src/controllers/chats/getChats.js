const Chat = require("../../models/chat_model");

async function getChats (req, res) {
  try {
    const loggedInUserId = req.user._id;

    let chats = await Chat.find({
      participants: loggedInUserId,
    })
      .populate("participants", "firstName lastName mainPhoto about")
      .lean();

    chats = chats.map((chat) => {
      const otherUser = chat.participants.find(
        (user) => user._id.toString() !== loggedInUserId.toString()
      );
      return {
        ...chat,
        otherUser,
      };
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = getChats