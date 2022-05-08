const jwt = require("jsonwebtoken");

// requires authorization header with valid access token
// Authorization: Barear <access token>
// saves access token data in res.userData param
module.exports = function (req, res, next) {

    try {

        if (!req.headers.authorization || req.headers.authorization.split(' ').length !== 2)
            return res.status(401).send("No authorization token provided")

        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.JWT_SECRET, {},async (err, decoded) => {
            if (err) return res.status(401).send("Not authenticated")

            res.userData = decoded

            return next()
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
}