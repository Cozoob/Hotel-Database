const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Reservation = require('../modules/Reservation')
const User = require('../modules/User');
const Room = require('../modules/Room');

const isAuthenticated = require('../middleware/auth/isAuthenticated')
const isReservationOwner = require('../middleware/auth/isReservationOwner')
const isReservationOwnerOrEmployeeOrAdmin = require('../middleware/auth/isReservationOwnerOrEmployeeOrAdmin')
const isHimselfOrAdmin = require('../middleware/auth/isHimselfOrAdmin')
const isAdmin = require('../middleware/auth/isAdmin')

//CREATE
router.post('/:id', isAuthenticated, async (req, res) => {
    try {
        const body = req.body
        const id = req.params.id
        const reservation = await Reservation.create({
            room: body.room,
            amount: body.amount,
            date: body.date,
            numberOfDays: body.numberOfDays,
            user: id
        })

        if (!isFutureReservation(body.date)) {
            return res.status(400).send("Can'create reservation in past")
        }

        if (!isRoomAvailable(body.room, body.date, body.numberOfDays)) {
            return res.status(400).send("All this rooms are booked in this term")
        }

        const user = await User.findByIdAndUpdate(id, { $addToSet: { reservations: { reservation: reservation._id } } })

        res.status(200).json({
            message: "Reservation created successfully",
            reservation: reservation
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
})


// READ 
// get all user reservations
router.get('/:id', isAuthenticated, isHimselfOrAdmin("id"), async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find user with given id")
            return
        }

        const user = await User.findById(id)

        res.status(200).json({
            status: 'success',
            reservations: user.reservations
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})


//get user (uid) reservation (rid)
router.get('/:uid/:rid', isAuthenticated, isReservationOwnerOrEmployeeOrAdmin("uid", "rid"), async (req, res) => {
    try {
        const userId = req.params.uid
        const reservationId = req.params.rid
        if (!mongoose.isValidObjectId(userId)) {
            res.status(404).send("Can't find user with given id")
            return
        }
        if (!mongoose.isValidObjectId(reservationId)) {
            res.status(404).send("Can't find reservation with given id")
            return
        }
        const reservation = await Reservation.findById(reservationId)
        const sortedReservations = reservation.sort((a, b) => b.date - a.date)

        res.status(200).json({
            status: 'success',
            reservation: sortedReservations
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})


// get all reservations
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const reservation = await Reservation.find();
        const sortedReservations = reservation.sort((a, b) => a.date - b.date)
        res.status(200).json(sortedReservations);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
})


//UPDATE 
//update user (uid) reservation (rid)
router.put('/:uid/:rid', isAuthenticated, isReservationOwner("uid", "rid"), async (req, res) => {
    try {
        const userId = req.params.uid
        const reservationId = req.params.rid
        if (!mongoose.isValidObjectId(userId)) {
            res.status(404).send("Can't find user with given id")
            return
        }
        if (!mongoose.isValidObjectId(reservationId)) {
            res.status(404).send("Can't find reservation with given id")
            return
        }
        const reservation = await Reservation.findByIdAndUpdate(reservationId, { $set: req.body },
            { new: true, runValidators: true }).lean()

        res.status(200).json({
            status: 'success',
            reservation: reservation
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})


//DELETE
//delete user (uid) reservation (rid) from user reservations and all reservations 
router.delete('/:uid/:rid', isAuthenticated, isReservationOwnerOrEmployeeOrAdmin("uid", "rid"), async (req, res) => {
    try {
        const userId = req.params.uid
        const reservationId = req.params.rid
        const user = await User.findByIdAndUpdate(userId, { $pull: { reservations: { reservation: reservationId } } })
        const reservation = await Reservation.findByIdAndDelete({ _id: reservationId })

        res.status(200).json({
            message: "Reservation deleted successfully",
            reservation: reservation
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
})


function isFutureReservation(date) {
    let today = new Date()
    let todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    return ((new Date(date).getTime() - new Date(todayDate).getTime()) / 86400000) >= 0
}

async function isRoomAvailable(room, from, noDays) {
    let cnt = 0

    //new reservation start and end date
    from = new Date(from)
    let to = new Date(from)
    let newStart = from.setDate(from.getDate())
    let newEnd = to.setDate(to.getDate() + noDays)

    const reservations = await Reservation.find();


    for (let reservation of reservations) {
        if (reservation.room.valueOf() === room) {
            console.log(reservation)
            // creted reservation start and end date
            let fromR = new Date(reservation.date)
            let toR = new Date(reservation.date)
            let start = fromR.setDate(fromR.getDate())
            let end = toR.setDate(toR.getDate() + reservation.numberOfDays)

            if ((start < newEnd && newEnd <= end) || (start <= newStart && newStart < end) || (start <= newStart && newEnd <= end)) {
                cnt++
            }

        }
    }
    const roomObject = await Room.findById(room)
    if (cnt < roomObject.maxAvailableNumber)
        return true
    return false
}

module.exports = router