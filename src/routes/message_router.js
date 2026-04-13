const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const getMessages = require("../controllers/messages/getMessages");
const router = express.Router();

router.get("/messages/:chatId", userAuth, getMessages);

module.exports = router;
