const s3 = require("../../utils/bucketS3");
const User = require("../../models/user_model");

const getKeyFromUrl = (fileUrl) => {
  try {
    const url = new URL(fileUrl);
    return url.pathname.slice(1);
  } catch {
    throw new Error("Invalid URL");
  }
};

async function deleteMedia (req, res) {
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
}

module.exports = deleteMedia