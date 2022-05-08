const roleEnum = require('../../enums/Role')

// requires to check isAuthorized before
module.exports = function (req, res, next) {
    try {

        if (!res.userData)
            throw new Error("Expected res.userData; Check isAuthorized first")


        if (res.userData.roleID !== roleEnum.ADMIN_ID)
            return res.status(403).send("Not authorized")

        return next()

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
}