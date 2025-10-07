async function logout (req, res) {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
     res.send("Logout Successful!!");
    }
    
    module.exports = logout
