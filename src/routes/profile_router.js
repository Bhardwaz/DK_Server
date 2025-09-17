const express = require("express")
const { userAuth } = require("../middleware/userAuth.js")
const { validateEditProfileData } = require("../utils/validation.js")
const User = require("../models/user_model.js")

const router = express.Router()

router.get('/profile/view/:id', userAuth, async (req, res) => {
      try{
         const { id } = req.params
         console.log(req.params, "req params")
         const user = await User.findById({ _id: id })
         
         res.status(200).send(user)
      } catch(err){
        console.log(err);
        res.status(400).send("Error : " + err.message)
      }  
})

router.patch('/profile/edit', userAuth, async (req, res) => {
        try { 
           if(!validateEditProfileData(req)){
              return res.status(400).send("Field can not be edited")
            }

           const loggedInUser = req.user
           Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])

           await loggedInUser.save()

           res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
          });

           } catch (err) {
            console.log(err);
            res.status(400).send("ERROR : " + err.message);
           }
})

module.exports = router