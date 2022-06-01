const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const app = express();
const jwt = require("jsonwebtoken");
const Log = require('./modules/Log');
require('dotenv/config')

// MIDDLEWARE
app.use(async (req, res, next) => {

    if (req.headers.origin)
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, OPTIONS')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token')

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");


    return next()
})

// logs
app.use(async (req, res, next) => {
    let date = new Date(Date.now())
    console.log(req.method + " " + req.url + " at " + date)

    let newLog = {
        method: req.method,
        url: req.url,
        date: date,
    }

    jwt.verify(
        req.headers.authorization && req.headers.authorization.split(' ').length === 2 ? req.headers.authorization.split(' ')[1] : undefined,
        process.env.JWT_SECRET,
        {},
        async (err, decoded) => {
            if (err) Log.create(newLog).then()

            newLog.user = decoded
            Log.create(newLog).then()
    })

    return next()
})

app.use(bodyParser.json())


// IMPORT ROUTES
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const roomsRoute = require('./routes/rooms');
const reservationsRoute = require('./routes/reservations');
const ratingRoute = require('./routes/rating');


app.use('/', authRoute);
app.use('/user', userRoute);
app.use('/rooms', roomsRoute);
app.use('/reservations', reservationsRoute);
app.use('/rating', ratingRoute);

// ROUTES
app.get('/', ((req, res) => {
    res.send("SIEMA GIENIU");
    // res.status(200).sendFile(__dirname + "/static/index.html")
}))


// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log("Connected successfully to DB")
    })
    .catch((err) => {
        console.log(`Connecting to DB failed \n ${err}`)
        process.exit(1)
    })


// START LISTENING
const PORT = 8000;
const server = app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)

});