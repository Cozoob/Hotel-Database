const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Reservation = require('../modules/Reservation')
const User = require('../modules/User');


//CREATE
router.post('/:id', async (req, res) => {
    try {
        const body = req.body
        const id = req.params.id
        const reservation = await Reservation.create({
            rooms: body.rooms,
            amount: body.amount,
            date: body.date,
            numberOfDays: body.numberOfDays
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
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find user with given id")
            return
        }

        const user = await User.findById(id)

        // zostawiam na przyszłość żeby nie tracić tyle czasu szukając na stacku
        //E11000 duplicate key error collection
        //Reservation.collection.dropIndexes()

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
router.get('/:uid/:rid', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.put('/:uid/:rid', async (req, res) => {
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
router.delete('/:uid/:rid', async (req, res) => {
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