const User = require('../../models/user_model.js')
const {validateSignUpData} = require("../../utils/validation.js")
const bcrypt = require("bcryptjs")

async function signup(req, res) {
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
}

module.exports = signup