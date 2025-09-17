const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const router = express.Router();
const AWS = require("aws-sdk");
const User = require("../models/user_model");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getKeyFromUrl = (fileUrl) => {
  try {
    const url = new URL(fileUrl);
    return url.pathname.slice(1);
  } catch {
    throw new Error("Invalid URL");
  }
};

router.post("/upload-url", userAuth, async (req, res) => {
  const { _id, fileType } = req.user;
  const key = `users/${_id}/${Date.now()}.jpg`;

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: fileType,
      Expires: 300,
    });

    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    await User.findByIdAndUpdate(_id, { $push: { photoUrl: fileUrl } });

    res.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating upload URL" });
  }
});

router.delete("/delete-photo", userAuth, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    // const key = getKeyFromUrl(fileUrl);
    const key = fileUrl;
    const { _id } = req.user;

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
      .promise();

    await User.findByIdAndUpdate(
      _id,
      { $pull: { photoUrl: fileUrl } },
      { new: true }
    );

    res.status(200).json({ fileUrl, message: "Photo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete photo" });
  }
});

router.post("/set-main", userAuth, async (req, res) => {
  try {
    const { fileUrl } = req.body.data;
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.photoUrl.includes(fileUrl)) {
      return res
        .status(400)
        .json({ message: "Photo not found in user gallery" });
    }

    user.mainPhoto = fileUrl;
    await user.save();

    res.status(200).json({
      message: "Main photo updated successfully",
      mainPhoto: user.mainPhoto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
