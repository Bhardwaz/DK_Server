const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
  participants: [
    { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true 
    }],
  lastMessage: {
    content: String,
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    }
  },
  unreadCount:{
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema);
