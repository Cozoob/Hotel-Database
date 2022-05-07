const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../modules/User');
const RefreshToken = require('../modules/RefreshToken');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randToken = require('rand-token')

require('dotenv/config')

const REFRESH_TOKEN_LENGTH = 256
const ACCESS_EXPIRES_IN = 60*5

// AUTH
router.post('/register', async (req, res) => {
    try {
        const body = req.body
        if (!(body.username && body.email && body.password))
            return res.status(400).send({registration:false, error:"Invalid data"})

        const username = body.username
        const email = body.email
        const salt = bcrypt.genSaltSync(12)
        const passwordHash = bcrypt.hashSync(body.password, salt)

        const result = await User.findOne({$or:[
                {username:username},
                {email:email}
            ]})

        if (result)
            return res.status(400).send({registration:false, error:"Username or email already in use"})

        User.create({
            username: username,
            email: email,
            passwordHash: passwordHash
        }, (err, user)=>{
            if (err) return res.status(400).send({registration:false, error:"Data validation failed"})

            return res.status(201).send({registration:true, error:"New user registered"})
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/login', async (req, res) => {
    try {
        const body = req.body
        if (!((body.username || body.email) && body.password))
            return res.status(400).send({login:false, message:"Invalid data"})

        const username = body.username
        const email = body.email
        const password = body.password

        User.findOne({$or: [{username: username}, {email: email}]},{passwordHash:1, _id:1, username:1, email:1, roleID:1},{}, async (err, user)=>{
            if (err) return res.status(500).send("Something went wrong")
            if (!user) return res.status(401).send({login:false, message:"Invalid data"})

            if (!bcrypt.compare(password, user.passwordHash))
                return res.status(401).send({login:false, message:"Invalid data"})

            // access token
            let accessToken = await signAccess(user, ACCESS_EXPIRES_IN)

            // refresh token
            let refreshToken = await setRefreshTokenForUser(user)
            if (!refreshToken)
                throw new Error("Max amount of finding refresh token tries exceeded")


            return res.status(200).json({login:true, message:"Logged in successfully", access: accessToken, refresh: refreshToken})
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/token/refresh', async (req, res) => {
    try {

        let token = req.body.refresh

        await RefreshToken.findOne({refreshToken:token}, {}, {}, async (err, record) => {
            if (err) throw new Error("Error fetching refresh token")
            if (!record) return res.status(401).send("Invalid token")
            if (tokenExpired(record.expDate)) return res.status(401).send("Token expired")

            let user = await User.findById(record.userID)
            let newAccessToken = await signAccess(user, ACCESS_EXPIRES_IN)
            let newRefreshToken = await setRefreshTokenForUser(user)
            if (!newRefreshToken){
                throw new Error("Max amount of finding refresh token tries exceeded")
            }

            return res.status(200).json({access: newAccessToken, refresh: newRefreshToken})
        }).clone()

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/token/reject', async (req, res) => {
    try {

        let refreshToken = req.body.refresh
        await deleteRefreshToken(refreshToken)
        res.status(204).send("Logged out successfully")

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

async function signAccess(user, expiresIn){
    return await jwt.sign({
            _id: user._id,
            username: user.username,
            email: user.email,
            roleID: user.roleID
        },
        process.env.JWT_SECRET,
        {expiresIn: expiresIn})
}

function tokenExpired(expDate){
    return expDate < Date.now()
}

async function setRefreshTokenForUser(user){
    let attempt = 1
    let refreshToken = randToken.uid(REFRESH_TOKEN_LENGTH)
    while (attempt <= 3 && !await setRefreshToken(user, refreshToken)) {
        refreshToken = randToken.uid(REFRESH_TOKEN_LENGTH)
        attempt += 1
    }

    if (attempt > 3)
        return null

    return refreshToken
}

async function setRefreshToken(user, token){

    let result = true;
    await RefreshToken.updateOne(
        {
            userID:user._id
        },
        {
            userID:user._id,
            refreshToken: token,
            expDate: addDays(Date.now(), 1)
        },
        {
            upsert: true
        }
    ).catch((err)=>{
        console.log(err)
        result = false
    })

    return result // success or fail
}

async function deleteRefreshToken(token){
    await RefreshToken.findOneAndDelete({refreshToken:token})
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports = router