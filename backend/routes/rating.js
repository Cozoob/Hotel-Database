const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Rating = require('../modules/Rating');
const RoleEnum = require('../enums/Role');
const Reservation = require('../modules/Reservation');
const Room = require('../modules/Room');

// CREATE AND UPDATE
router.put('/:id', async (req, res, next) => {
    try{
        if(!mongoose.isValidObjectId(req.params.roomID)){
            return res.status(404).send("No room found with given ID.");
        }

        if(!req.body.rating || !(req.body.rating >= 0 && req.body.rating <= 5)){
            return res.status(400).send("Wrong rating data.");
        }

        const reservedRooms = JSON.parse(JSON.stringify(await Room.find({
            roomID: req.params.roomID,
            userID: res.userID
        })));

        const rate = await Rating.findOne({
            roomID: req.params.roomID,
            userID: res.userID
        });

        if(rate ===  null){
            const newRating = await Rating.create({
                roomID: req.params.roomID,
                userID: res.userID,
                rating: req.body.rating
            }).catch(err => {
                if(err) return res.status(400).send({
                    rated: false,
                    message: "Data validation failed"
                })
            })

            const calculatedRating = await calculatedRating(req.params.roomID);
            return res.status(201).send({
                rated: true,
                userRating: newRating.rating,
                rating: calculatedRating.rating,
                ratingsAmount: calculatedRating.amount
            });
        } else {
            Rating.findOneAndUpdate({roomID: req.params.roomID, userID: req.userID},
                {rating: req.body.rating},
                {new: true},
                async (err, newRating) => {
                    if(err) return res.status(400).send({rated: false, message: "Data validation failed"})

                    const calculatedRating = await calculateRoomRating(req.params.roomID);
                    return res.status(201).send({
                        rated: true, 
                        userRating: newRating.rating,
                        rating: calculatedRating.rating,
                        ratingsAmount: calculatedRating.amountOfRatings
                    });
                }
                )
        }
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