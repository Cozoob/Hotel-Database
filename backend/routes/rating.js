const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Rating = require('../modules/Rating');
const RoleEnum = require('../enums/Role');
const Reservation = require('../modules/Reservation');
const Room = require('../modules/Room');


router.post('/:id', async (req, res) => {
    try {
        const body = req.body
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send("No room found with given ID.");
        }

        if (!mongoose.isValidObjectId(body.reservation)) {
            return res.status(404).send("No reservation found with given ID.");
        }

        if (!mongoose.isValidObjectId(body.user)) {
            return res.status(404).send("No user found with given ID.");
        }

        if (!body.rating || !(body.rating >= 0 && body.rating <= 5)) {
            return res.status(400).send("Wrong rating data.");
        }

        const reservation = await Reservation.find({
            room: id,
            user: body.user,
            _id: body.reservation
        })

        if (reservation == null) {
            return res.status(404).send("Can't find reservation with matching user id and room id")
        }

        // for every reservation only one rate can be added
        const ratingExist = await Rating.find({
            reservation: body.reservation
        })


        if (ratingExist.length > 0) {
            return res.status(404).send("Can't add more than one rate to one reservation")
        }

        const rating = await Rating.create({
            room: id,
            user: body.user,
            reservation: body.reservation,
            rating: body.rating
        })

        const calculatedRating = await calculateRoomRating(id);

        return res.status(201).send({
            rating: rating,
            ratingTotal: calculatedRating.rating,
            ratingsAmount: calculatedRating.amountOfRatings
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Something not ok.")
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find rating with given id")
            return
        }

        const rating = await Rating.findByIdAndDelete(id)

        if (rating !== null) {
            res.status(200).json("Rating deleted successfully")
        }
        else {
            res.status(404).send("Can't find rating with given id")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
})


router.get('/', async (req, res) => {
    try {
        const calculatedRating = await calculateEveryRoomRating()
        return res.status(200).json(calculatedRating);
    }
    catch (err) {
        return res.status(500).send("Something went wrong!");
    }
})


async function calculateRoomRating(room) {
    let allRatings = JSON.parse(JSON.stringify(await Rating.find({ room: room })));
    let amount = allRatings.length;
    let sum = 0;
    for (let rate of allRatings) {
        sum += rate.rating;
    }

    let rating = 0;
    if (sum != 0)
        rating = sum / amount

    return {
        rating: rating,
        amountOfRatings: amount,
        room: room
    }
}


async function calculateEveryRoomRating() {
    let result = []
    let allRooms = JSON.parse(JSON.stringify(await Room.find()));

    for (let room of allRooms) {
        const calculatedRating = await calculateRoomRating(room._id);
        result.push(calculatedRating)
    }
    return result
}

module.exports = router