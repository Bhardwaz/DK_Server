const User = require('../../models/user_model.js')

async function signin(req, res){
    try
         {
           const { email, password } = req.body
           if(!email || !password) return res.status(400).send("All values are required")
           const user = await User.findOne({ email })
           if(!user) return res.status(400).send("User does not exist")
           
           const isPasswordValid = await user.validatePassword(password)
     
           if(!isPasswordValid) return res.status(400).send("Password is incorrect. Access denied")
     
           const token = await user.generateToken()
     
           res.cookie("token", token, {
             httpOnly:true,
             secure:true,
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
}

module.exports = signin