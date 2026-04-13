const express = require("express")
const router = express.Router()
const { userAuth } = require("../middleware/userAuth.js")
const signin = require("../controllers/auth/signin.js")
const signup = require("../controllers/auth/signup.js")
const loggedInUser = require("../controllers/auth/loggedInUser.js")
const logout = require("../controllers/auth/logout.js")

router.post("/signin", signin)
router.post("/signup", signup)
router.post("/logout", logout);
router.get("/auth/loggedInUser", userAuth, loggedInUser)

module.exports = router