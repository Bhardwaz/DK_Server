const User = require("../../models/user_model");

async function viewProfile (req, res) {
      try{
         const { id } = req.params
         console.log(req.params, "req params")
         const user = await User.findById({ _id: id })
         
         res.status(200).send(user)
      } catch(err){
        console.log(err);
        res.status(400).send("Error : " + err.message)
      }  
}

module.exports = viewProfile