const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
      },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    photoUrl: {
       type: String,
       required: true
    },
    firstName: {
      type:String,
      required:true
    },
    lastName: {
      type: String,
      required: true
    },
    content: {
        type: String,
        trim: true
    },
     messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    }
}, { timestamps: true })


module.exports = mongoose.model('Message', messageSchema)