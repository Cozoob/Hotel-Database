const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const app = express();
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


app.use((req, res, next) => {
    console.log(req.method + " " + req.url + " at " + new Date(Date.now()))
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
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)

});