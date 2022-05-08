const roleEnum = require('../../enums/Role')

// requires to check isAuthorized before
module.exports = function (userIDParamName, ratingIDParamName) {
    return (req, res, next) => {
        try {

            // todo
            return next()

        } catch (err) {
            console.log(err)
            return res.status(500).send("Something went wrong")
        }
    }
}