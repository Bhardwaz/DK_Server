const express = require('express')
const { userAuth } = require("../middleware/userAuth.js")
const feedUser = require('../controllers/feed/feedUser.js')
const router = express.Router()

router.get('/feed', userAuth, feedUser)

module.exports = router
