const express = require("express")
const { userAuth } = require("../middleware/userAuth")
const connectionsWithoutChat = require("../controllers/requests/connectionsWithoutChat")
const getReceivedRequests = require("../controllers/requests/getReceivedRequests")
const reviewConnectionRequest = require("../controllers/requests/reviewConnectionRequest")
const sendConnectionRequest = require("../controllers/requests/sendConnectionRequest")
const router = express.Router()

router.post("/request/send/:status/:toUserId", userAuth, sendConnectionRequest)

// on receiver end
router.post("/request/review/:status/:requestId", userAuth, reviewConnectionRequest)

// find all connection request which are accepted && they dont exist in chat collection

// GET /allConnections
router.get("/connectionsWithoutChat", userAuth, connectionsWithoutChat);

router.get("/user/requests/received", userAuth, getReceivedRequests)

module.exports = router
