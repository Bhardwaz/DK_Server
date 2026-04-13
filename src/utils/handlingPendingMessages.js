const Message = require("../models/message_model")

const handlingPendingMesssages = async (receiver) => {
    if(!receiver) return
    const pendingMessages = await Message.find({
        receiver, 
        status: 'sent'
    })
    if(!pendingMessages) return

    const chatIds = [...new Set(pendingMessages.map(m => m.chat))]
    const senders = [...new Set(pendingMessages.map(m => m.sender))];

    await Message.updateMany(
       { receiver, status: "sent" },
       { $set: { status: "delivered" } }
    )

    return {senders, pendingMessages}
}

module.exports = handlingPendingMesssages