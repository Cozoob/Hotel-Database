const roleEnum = require('../../enums/Role')

// requires to check isAuthorized before
module.exports = function (userIDParamName) {
    return (req, res, next) => {
        try {

            let reqUserID = req.params[userIDParamName]
            if (!reqUserID)
                throw new Error("Expected req.param."+userIDParamName+"; Provide valid requested userID key")

            if (!res.userData)
                throw new Error("Expected res.userData; Check isAuthorized first")


            if (res.userData._id !== reqUserID)
                return res.status(403).send("Not authorized")

            return next()

        } catch (err) {
            console.log(err)
            return res.status(500).send("Something went wrong")
        }
    }
}