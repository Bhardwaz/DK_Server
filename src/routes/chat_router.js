const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const getChats = require("../controllers/chats/getChats");
const router = express.Router();

router.get("/chats", userAuth, getChats);

module.exports = router;
