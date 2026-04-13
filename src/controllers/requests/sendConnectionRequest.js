const ConnectionRequest = require("../../models/connectionRequest_model")
const User = require("../../models/user_model")

async function sendConnectionRequest (req, res) {
       try {
        const fromUserId = req.user._id
        const { toUserId } = req.params
        const { status } = req.params

        const allowedStatus = ["interested", "ignored"]
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                "message": "Invalid status type " + status
            })
        }

        // if there is an existing connection already then it should not re-connect
        const existingConnectionRequest = await ConnectionRequest.findOne(
        {
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId}
          ]
        })

        if(existingConnectionRequest){
            return res.status(400).send({ 
                message: "connection already exists"
             })
        }


        const toUser = await User.findById(toUserId);
        if (!toUser) 
        {return res.status(404).json({ message: "User not found!" })}
        
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
          message:
            req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
        
       } catch (error) {
          console.log(error);
       }
}

module.exports = sendConnectionRequest