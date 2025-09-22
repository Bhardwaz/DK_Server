const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;
    
    console.log("Headers:", req.headers);
    console.log("Token from header:", req.headers.authorization);
    console.log("Cookies:", req.cookies);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decodedObj = await jwt.verify(token, process.env.TOKEN_SECRET);
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = { userAuth };
