const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { createServer } = require("http");
const authRouter = require("./src/routes/auth_router.js");
const profileRouter = require("./src/routes/profile_router.js");
const connectionRequestRouter = require("./src/routes/request_router.js");
const userRouter = require("./src/routes/user_router.js");
const chatRouter = require("./src/routes/chat_router.js");
const feedRouter = require("./src/routes/feed_router.js");
const preSignedUrlRouter = require("./src/routes/upload_router.js");
const messageRouter = require("./src/routes/message_router.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const Chat = require("./src/models/chat_model.js");
const Message = require("./src/models/message_model.js");
const handlingPendingMesssages = require("./src/utils/handlingPendingMessages.js");
const rateLimit = require("express-rate-limit");
const { default: helmet } = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const logger = require("./logger.js")
const morgan = require("morgan");
const { connectingToDatabase } = require("./src/config/database.js");

const morganFormat = ":method :url :status :response-time ms";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP. Please try later",
});

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    ...Object.getOwnPropertyDescriptor(req, 'query'),
    value: req.query,
    writable: true,
  });
  next();
});

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const server = createServer(app);
const corsOptions = {
  origin: process.env.FRONTEND_SERVICE_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
  ],
};

const io = new Server(server, { cors: corsOptions });
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// security middleware -- rate limiter
app.use("/", limiter);
app.use(helmet());
app.use(mongoSanitize())
app.use(hpp());

// routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);
app.use("/", feedRouter);
app.use("/", chatRouter);
app.use("/", messageRouter);
app.use("/", preSignedUrlRouter);

const users = new Map();
const activeChats = new Map();

io.use((socket, next) => {
  const { sender } = socket.handshake.auth;
  if (!sender) return next(new Error("Unauthorized"));
  socket.sender = sender;
  next();
});

io.on("connection", (socket) => {
  console.log("✅ A user Connected", socket.id);

  socket.on("register", async (sender) => {
    users.set(sender, socket.id);
    io.to(sender).emit("user:online", { sender, online: true });

    const { senders, pendingMessages } = await handlingPendingMesssages(sender);

    senders.forEach((s) => {
      const sid = s.toString();
      if (users.has(sid)) {
        const userSocket = users.get(sid);
        const messages = pendingMessages.filter((p) => p.sender === s);
        console.log(messages, "messages");
        io.to(userSocket).emit("pending:delivered", messages);
      }
    });

    console.log(`User ${sender} registered with socket ${socket.id}`);
  });

  socket.on("chat:send", async (msg) => {
    try {
      const { sender, targetUserId, tempId } = msg;
      const uid = [sender, targetUserId].sort().join("-");
      socket.chats = socket.chats || {};
      let chat = socket.chats[uid];

      if (!chat) {
        chat = await Chat.findOne({
          participants: { $all: [sender, targetUserId] },
        });
        if (!chat) chat = new Chat({ participants: [sender, targetUserId] });
        socket.chats[uid] = chat;
      }

      const newMessage = new Message({
        receiver: targetUserId,
        photoUrl: msg.photoUrl,
        firstName: msg.firstName,
        lastName: msg.lastName,
        chat: chat?._id,
        sender,
        content: msg.content,
        messageType: "text",
        status: "sent",
        createdAt: new Date(),
      });

      if (chat && newMessage) {
        chat.lastMessage.content = newMessage.content;
        chat.lastMessage.sender = sender;
        chat.unreadCount = chat.unreadCount + 1;
        await chat.save();
        await newMessage.save();
      }

      const targetSocketId = users.get(targetUserId);
      const senderSocketId = users.get(sender);

      const seeing = activeChats.get(targetUserId);
      const cid = chat._id.toString();

      if (targetSocketId && !seeing) {
        io.to(targetSocketId).emit("chat:receive", {
          ...newMessage.toObject(),
          tempId,
          status: "delivered",
          unreadCount: chat.unreadCount,
          seeing: false,
        });
      }

      if (targetSocketId && seeing === cid) {
        io.to(targetSocketId).emit("chat:receive", {
          ...newMessage.toObject(),
          tempId,
          status: "read",
          seeing: true,
        });
        chat.unreadCount = 0;
        await chat.save();
      }

      if (senderSocketId && !targetSocketId) {
        io.to(senderSocketId).emit("chat:stored", {
          tempId,
          status: "sent",
          messageId: newMessage._id,
          chat: chat?._id,
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("message error", {
        tempId: msg.tempId,
        error: "Failed to send",
      });
    }
  });

  socket.on(
    "chat:delivered",
    async ({ tempId, chat, messageId, sender, receiver, seeing }) => {
      const senderSocket = users.get(sender);
      let status = seeing ? "read" : "delivered";
      try {
        await Message.findByIdAndUpdate(messageId, { status });
        if (senderSocket) {
          io.to(senderSocket).emit("chat:status", {
            tempId,
            chat,
            messageId,
            sender,
            receiver,
            status,
          });
        }
      } catch (error) {
        console.error("Error updating to delivered:", error);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
    users.delete(socket.sender);
  });

  socket.on("chat:active", async ({ chat, reader }) => {
    if (!activeChats.has(reader)) activeChats.set(reader, chat);

    try {
      const readMessages = await Message.find({
        chat,
        receiver: reader,
        status: { $in: ["sent", "delivered"] },
      });

      await Message.updateMany(
        { chat, receiver: reader, status: { $in: ["sent", "delivered"] } },
        { $set: { status: "read" } }
      );

      const chatDoc = await Chat.findById(chat);
      chatDoc.unreadCount = 0;
      chatDoc.lastMessage.status = "read";
      await chatDoc.save();

      readMessages.forEach((msg) => {
        const id = msg.sender.toString();
        const senderSocket = users.get(id);
        if (senderSocket) {
          io.to(senderSocket).emit("chat:status", {
            tempId: "notExist",
            chat,
            messageId: msg._id,
            sender: msg.sender,
            receiver: msg.receiver,
            status: "read",
          });
        }
      });
    } catch (error) {
      console.error("Error in chat:read", error);
    }
  });

  socket.on("chat:inactive", ({ chat, reader }) => {
    if (activeChats.has(reader)) {
      activeChats.delete(reader);
    }
  });
});

connectingToDatabase()
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`Listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB Connection Error:", err));
