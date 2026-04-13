const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const uploadUrl = require("../controllers/media/uploadUrl");
const deleteMedia = require("../controllers/media/deleteMedia");
const setProfilePic = require("../controllers/media/setProfilePic");
const router = express.Router();

router.post("/upload-url", userAuth, uploadUrl);
router.delete("/delete-photo", userAuth, deleteMedia);
router.post("/set-main", userAuth, setProfilePic);

module.exports = router;
