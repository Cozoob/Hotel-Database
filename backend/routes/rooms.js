const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Room = require('../modules/Room');
const RoleEnum = require('../enums/Role');

// wszystko zakomentowane trzeba dodać jak stworzymy logowanie i weryfikacje użytkownika

//CREATE
router.post('/', async (req, res, next) => {
    try {
        const body = req.body;
        let validationFailed = false;

        const room = await Room.create({
            name: body.name,
            maxAvailableNumber: body.maxAvailableNumber,
            price: body.price,
            description: body.description,
            imageLink: body.imageLink
        })
        // .catch(err => {
        //     if (err) {
        //         res.status(400).send("Data validation failed")
        //         validationFailed = true
        //     }
        // })

        if (validationFailed)
            return

        res.status(200).json({
            // message: "Room created successfully",
            room
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
    // }])
})


// READ
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
})


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find room with given id")
            return
        }

        const room = await Room.findById(id)

        if (room !== null) {
            res.status(200).json(room)
        }
        else {
            res.status(200).json([])
        }


    }
    catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
})


//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find room with given id")
            return
        }

        const body = req.body
        let validationFailed = false

        const room = await Room.findByIdAndUpdate(id, { $set: body },
            { new: true, runValidators: true }).lean()
        // .catch(err => {
        //     if (err) {
        //         res.status(400).send("Data validation failed")
        //         validationFailed = true
        //     }
        // })

        if (validationFailed)
            return


        if (room !== null) {
            res.status(200).json({
                message: "Room updated successfully",
                room: room
            })
        }
        else {
            res.status(404).send("Can't find room with given id")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
    // }])
})


// DELETE
// router.delete('/:id',[verifyUser([RoleEnum.ADMIN]), async (req, res, next) => {
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find room with given id")
            return
        }

        const room = await Room.findByIdAndDelete(id)

        if (room !== null) {
            res.status(200).json("Room deleted successfully")
        }
        else {
            res.status(404).send("Can't find room with given id")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
    // }])
})


module.exports = router