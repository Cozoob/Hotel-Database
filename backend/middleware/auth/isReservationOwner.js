const roleEnum = require('../../enums/Role')

// requires to check isAuthorized before
module.exports = function (userIDParamName, reservationIDParamName) {
    return (req, res, next) => {
        try {

            let reqUserID = req.params[userIDParamName]
            if (!reqUserID)
                throw new Error("Expected req.param."+userIDParamName+"; Provide valid requested userID key")

            let reqReservationID = req.params[reservationIDParamName]
            if (!reqReservationID)
                throw new Error("Expected req.param."+reqReservationID+"; Provide valid requested reservationID key")

            if (!res.userData)
                throw new Error("Expected res.userData; Check isAuthorized first")

            if (!reqReservationID in res.userData.reservations) //todo sprawdzic czy dziala
                return res.status(403).send("Not authorized")

            return next()

        } catch (err) {
            console.log(err)
            return res.status(500).send("Something went wrong")
        }
    }
}