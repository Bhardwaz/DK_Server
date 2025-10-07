const express = require("express")
const { userAuth } = require("../middleware/userAuth.js")
const viewProfile = require("../controllers/profile/viewProfile.js")
const editProfile = require("../controllers/profile/editProfile.js")
const router = express.Router()

router.get('/profile/view/:id', userAuth, viewProfile)
router.patch('/profile/edit', userAuth, editProfile)

module.exports = router