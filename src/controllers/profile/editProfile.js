const { validateEditProfileData } = require("../../utils/validation");

async function editProfile (req, res) {
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
}

module.exports = editProfile