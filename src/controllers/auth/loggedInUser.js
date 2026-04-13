async function loggedInUser (req, res) {
    const user = req.user
    res.status(200).send(
        { 
          message: "success",
          user
        })
}

module.exports = loggedInUser