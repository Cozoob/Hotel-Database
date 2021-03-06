const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Room = require('../modules/Room');
const RoleEnum = require('../enums/Role');

const isAuthenticated = require('../middleware/auth/isAuthenticated')
const isEmployee = require('../middleware/auth/isEmployee')
const isAdmin = require('../middleware/auth/isAdmin')

//CREATE
router.post('/', isAuthenticated, isAdmin || isEmployee, async (req, res, next) => {
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

        if (validationFailed)
            return

        res.status(200).json({
            room
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
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


router.get('/:id', isAuthenticated, async (req, res) => {
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
router.put('/:id', isAuthenticated, isEmployee, async (req, res) => {
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
})


// DELETE
router.delete('/:id', isAuthenticated, isEmployee, async (req, res) => {
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
})


module.exports = router