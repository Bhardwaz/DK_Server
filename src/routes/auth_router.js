const express = require("express")
const User = require("../models/user_model.js")
const router = express.Router()
const {validateSignUpData} = require("../utils/validation.js")
const bcrypt = require("bcryptjs")
const { userAuth } = require("../middleware/userAuth.js")
const { faker } = require("@faker-js/faker")

router.post("/signin", async(req, res) => {
    try{
      const { email, password } = req.body
      if(!email || !password) return res.status(400).send("All values are required")
      const user = await User.findOne({ email })
      if(!user) return res.status(400).send("User does not exist")
      
      const isPasswordValid = await user.validatePassword(password)

      if(!isPasswordValid) return res.status(400).send("Password is incorrect. Access denied")

      const token = await user.generateToken()

      res.cookie("token", token, {
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        expires: new Date(Date.now() + 48 * 3600000),
      })
      
      res.status(200).send({
        message: "Signin Successfull", 
        user,
       });
      }
    catch(err){
        console.log(err);
        res.status(400).send("ERROR : " + err.message);
      }  
})

router.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req)         
        const { firstName, lastName, email, password, age, desiredAgeRange, gender, interestIn, mainPhoto, skills, location } = req.body
        
        const isExist = User.findOne({ email })
        if(isExist) res.status(403).json({ message: "This email is already registered with us" })

        // encrypt the password
        const hashPassword = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            age, 
            desiredAgeRange,
            gender, 
            interestIn,
            mainPhoto,
            skills,
            location
        })
        const savedUser = await user.save()
        const token = await savedUser.generateToken()
        
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        })
        res.json({ message: "User Added successfully!", savedUser });
    } catch (err) {
        console.log(err);
        res.status(400).send("ERROR : " + err.message);
    }     
})

router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
     res.send("Logout Successful!!");
    });

router.get("/auth/loggedInUser", userAuth, async (req, res) => {
    const user = req.user
    res.status(200).send(
        { 
          message: "success",
          user
        })
})


    
module.exports = router