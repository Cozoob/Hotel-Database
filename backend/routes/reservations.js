const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Reservation = require('../modules/Reservation')
const User = require('../modules/User');

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


// get all reservations
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const reservation = await Reservation.find();
        res.status(200).json(reservation);
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

module.exports = router