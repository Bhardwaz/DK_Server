const User = require("../../models/user_model");

async function setProfilePic (req, res) {
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
}

module.exports = setProfilePic