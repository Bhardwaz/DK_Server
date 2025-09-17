const express = require('express')
const { userAuth } = require("../middleware/userAuth.js")
const User = require('../models/user_model.js')
const router = express.Router()
const ConnectionRequest = require("../models/connectionRequest_model.js")
const ApiError = require("../utils/ApiError.js")

const profileCompleteness = (user) => {
    let profileScore = 0;
    if (user.bio) profileScore += 1;
    if (user.profilePicture) profileScore += 1;
    if (user.photos?.length >= 3) profileScore += 1;
    if (user.interests?.length > 0) profileScore += 1;

    const hoursSinceLastSeen = (Date.now() - new Date(user.lastSeen)) / (1000 * 60 * 60);
    const activityScore = Math.max(0, 24 - hoursSinceLastSeen); // higher if recent

    const totalScore = mutualInterestCount * 5 + activityScore * 2 + profileScore * 3;
    
    return totalScore
}

const canRefreshFeed =  async (user) => {
  const now = new Date();
  const last = user.lastFeedRefresh || new Date(0);
  const isSameDay = now.toDateString() === last.toDateString();

  if (!isSameDay) {
    // Reset count if new day
    user.refreshCount = 0;
  }

  if (user.refreshCount >= FEED_REFRESH_LIMIT) {
    throw new Error("Feed refresh limit reached. Try again tomorrow.");
  }

  user.refreshCount += 1;
  user.lastFeedRefresh = now;
  await user.save();

   // 4. Optional: Add premium boost
   // Premium users get 50 refreshes
   // Free users get 10
  // Track in user plan/role
};

const findInteractedUserIds = async(loggedInUser) => {
     const fromUserId = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser },
        { toUserId: loggedInUser }
    ]
    }).distinct('fromUserId');

     const toUserId = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser },
        { toUserId: loggedInUser }
    ]
    }).distinct('toUserId');
    
    return [...fromUserId, ...toUserId]

}

router.get('/feed', userAuth, async (req, res) => {
    try {
    const { interestIn, _id: loggedInUser, skills, gender: myGender, desiredAgeRange } = req.user

    const minAge = desiredAgeRange.min;
    const maxAge = desiredAgeRange.max;  
    
    const interactedUserIds = await findInteractedUserIds(loggedInUser)

    const usersForFeed = await User.find({
        _id: { $nin: interactedUserIds },
        gender: { $in : interestIn },
        interestIn: myGender
     }).select("-password")

    res.status(200).send({
      message: "successfull",
      status:200,
      feed : usersForFeed
    })
    } 
    
    catch (error) {
     console.log(error, "error in this route");
     throw new ApiError(error)
    }
})

module.exports = router
