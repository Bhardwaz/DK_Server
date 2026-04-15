async function logout (req, res) {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
    });
    
    res.send("Logout Successful!!");
}

module.exports = logout;