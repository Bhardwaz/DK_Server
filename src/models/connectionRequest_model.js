const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    status: {
        type: String,
        enum:{
           values: ['interested', 'accepted', 'ignored', 'rejected'],
           message:`{VALUE} is incorrect status type`
        }
    }
},
    { timestamps: true  }
)

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this

    // check if fromUserId and toUserId are same 
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('can not send connection request to yourself')
    }
    next()
})

connectionRequestSchema.index({ fromUserId:1, toUserId: 1 })

const ConnectionRequest = new mongoose.model('ConnectionRequest', connectionRequestSchema)

module.exports = ConnectionRequest