const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const app = express();
require('dotenv/config')

// MIDDLEWARE
app.use(async (req, res, next) => {

    if (req.headers.origin)
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token')


    return next()
})


app.use((req, res, next) => {
    console.log(req.method + " " +req.url + " at " + new Date(Date.now()))
    return next()
})

app.use(bodyParser.json())


// IMPORT ROUTES



// ROUTES
app.get('/', ((req, res) => {
    res.status(200).sendFile(__dirname + "/static/index.html")
}))


// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION)
    .then(()=>{
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