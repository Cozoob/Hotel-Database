const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Rating = require('../modules/Rating');
const RoleEnum = require('../enums/Role');
const Reservation = require('../modules/Reservation');
const Room = require('../modules/Room');

// CREATE AND UPDATE
router.put('/:roomID', async (req, res, next) => {
    try{
        if(!mongoose.isValidObjectId(req.params.roomID)){
            return res.status(404).send("No room found with given ID.");
        }

        if(!req.body.rating || !(req.body.rating >= 0 && req.body.rating <= 5)){
            return res.status(400).send("Wrong rating data.");
        }

        // todo check if rated room was reserved
        const reservedRooms = await Room.find({
            roomID: req.params.roomID,
            userID: res.userData._id
        });

        const newRating = await Rating.updateOne(
            {
                roomID: req.params.roomID,
                userID: res.userData._id,
            },
            {
                roomID: req.params.roomID,
                userID: res.userData._id,
                rating: req.body.rating
            },
            {
                upsert: true
            })
            .catch(err => {
                if(err) return res.status(400).send({
                    rated: false,
                    message: "Data validation failed"
                })
            })

        const calculatedRating = await calculateRoomRating(req.params.roomID);
        return res.status(201).send({
            rated: true,
            userRating: newRating.rating,
            rating: calculatedRating.rating,
            ratingsAmount: calculatedRating.amountOfRatings
        });

    } catch(err){
        console.log(err);
        return res.status(500).send("Something not ok.")
    }
});

async function calculateRoomRating(roomID){
    let allRatings = JSON.parse(JSON.stringify(await Rating.find({roomID: roomID})));
    let amount = allRatings.length;
    let sum = 0;
    for(let rate of allRatings){
        sum += rate.rating;
    }
    return {
        rating: sum / amount,
        amountOfRatings: amount
    }
}