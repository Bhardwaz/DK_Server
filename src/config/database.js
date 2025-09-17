const mongoose = require('mongoose')

const connectingToDatabase = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
}

module.exports = connectingToDatabase