const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Room = require('../modules/Room');
const Reservation = require('../modules/Reservation');
const Rating = require('../modules/Rating');
const Role = require('../modules/Role');
const User = require('../modules/User');
const RoleEnum = require('../enums/Role');

// CREATE
router.post('/login', (req, res, next) => {
    try{    
        const body = req.body;
        if(!(body.username && body.email && body.password)){
            // res.send(body);
            return res.status(400).send({
                registration: false,
                message: "Invalid data."
            });
        }

        const username = body.username;
        const email = body.email;
        // const salt = bcrypt.genSaltSync(12);
        // const passwordHash = bcrypt.hashSyns(body.password, salt);
        const passwordHash = body.password;

        User.findOne({
            $or : [{
                username: username
            },{
                email: email
            },{
                password: 1, _id: 1, username: 1, email: 1, roleID: 1
            }, async (err, user) => {
                if(err) return res.status(500).send("Something went wrong");
                if(!user) return res.status(401).send({
                    login: false,
                    message: "Invalid data."
                });
                
                // autentykacja???
                return res.status(200).json({
                    login: true,
                    message: "Logged in succesfully.",
                    user:{
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        roleID: user.roleID
                    }
                });
            }]
        });
    } catch (err){
        console.log(err);
        return res.status(500).send("Something went wrong.");
    }
});

router.post('/logout', (req, res, next) =>{
    try{
        return res.status(200).send({
            logout: true,
            message: "Logged out succesfully"
        });
    } catch (err){
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
});

router.post('/register', async (req, res, next) =>{
    try{
        const body = req.body;
        if(!(body.username && body.email && body.password)){
            // res.send(body);
            return res.status(400).send({
                registration: false,
                message: "Invalid data."
            });
        }

        const username = body.username;
        const email = body.email;
        // const salt = bcrypt.genSaltSync(12);
        // const passwordHash = bcrypt.hashSyns(body.password, salt);
        const passwordHash = body.password;

        const result = await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]
        });

        if(result){
            return res.status(400).send({
                registration: false,
                message: "Username or email already in use."
            });
        }

        User.create({
            username: username,
            email: email,
            passwordHash: passwordHash
        }, (err, user) =>{
            if(err) return res.status(400).send({
                registration: false,
                message: "Data validation failed."
            });
            return res.status(201).send({
                registration: true,
                message: "New user registered."
            });
        }
        );

    } catch(err){
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
});

// READ
router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (err){
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
});

router.get('/:id', async (req, res) =>{
    try{
        if(!((res.user && res.user._id === req.params.id) || (res.user && res.user.roleID == RoleEnum.ADMIN_ID))){
            return res.status(401).send({
                auth: false,
                message: "Not allowed!"
            });
        }

        if(!mongoose.isValidObjectId(res.params.id)){
            res.status(200).send(null);
            return
        }

        let user = await User.findById(res.params.id);
        if(user !== null){
            res.status(200).json(user);
        } else {
            res.status(200).send([]);
        }
    } catch (err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

// UPDATE
// TODO 


module.exports = router;