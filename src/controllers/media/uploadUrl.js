const User = require("../../models/user_model");
const s3 = require("../../utils/bucketS3")

async function uploadUrl (req, res) {
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
}

module.exports = uploadUrl