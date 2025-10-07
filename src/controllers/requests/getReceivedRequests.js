const ConnectionRequest = require("../../models/connectionRequest_model");

async function getReceivedRequests (req, res) {
     try {
        const loggedInUser = req.user
        
        const connectionRequest = await ConnectionRequest.find({
          toUserId: loggedInUser._id,
          status: 'interested'
        }).populate("fromUserId", "-password -desiredAgeRange -email -interestIn")
        
        return res.status(200).json({
            data: connectionRequest,
            message: "success"
        })

     } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
     }
}

module.exports = getReceivedRequests 