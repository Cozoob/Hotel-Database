const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../modules/User');
const bcrypt = require("bcrypt");

const isAuthenticated = require('../middleware/auth/isAuthenticated')
const isAdmin = require('../middleware/auth/isAdmin')
const isHimself = require('../middleware/auth/isHimself')

// READ
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
});

router.get('/:id', isAuthenticated, isHimself("id"), async (req, res) => {
    try {

        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(200).send(null);
            return
        }

        let user = await User.findById(req.params.id);
        if (user !== null) {
            res.status(200).json(user);
        } else {
            res.status(200).send([]);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});


// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find guest with given id")
            return
        }

        const user = await User.findByIdAndDelete(id)

        if (user !== null) {
            res.status(200).json("User deleted successfully")
        }
        else {
            res.status(404).send("Can't find user with given id")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
})


// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).send("Can't find user with given id")
            return
        }

        const body = req.body
        let validationFailed = false

        const user = await User.findByIdAndUpdate(id, { $set: body },
            { new: true, runValidators: true }).lean()
        // .catch(err => {
        //     if (err) {
        //         res.status(400).send("Data validation failed")
        //         validationFailed = true
        //     }
        // })

        if (validationFailed)
            return


        if (user !== null) {
            res.status(200).json({
                message: "User updated successfully",
                user: user
            })
        }
        else {
            res.status(404).send("Can't user room with given id")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
    // }])
})


module.exports = router;