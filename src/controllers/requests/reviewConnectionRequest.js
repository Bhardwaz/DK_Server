const ConnectionRequest = require("../../models/connectionRequest_model")

async function reviewConnectionRequest (req, res) {
       try {
        const loggedInUser = req.user
        const { status, requestId } = req.params

        const allowedStatus = ['accepted', 'rejected']
        if(!allowedStatus.includes(status)){
          return res.status(400).json({ message: "This status is not allowed" })
        }
        
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId: loggedInUser._id,
            status:'interested'
        })

        if(!connectionRequest){
            return res.status(404).send("No connection request found")
        }

        if(connectionRequest.status === status){
           return res.status(400).send({ message: "Request is already accepted" })
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()

        res.json({ message: "Connection Request " + status, data })

       } catch (error) {
          console.log(error);
          res.status(400).send(error.message, "error is from catch block")
       }
}

module.exports = reviewConnectionRequest