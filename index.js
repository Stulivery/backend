require('dotenv').config()

const express = require('express')
// mysql || mongodb?
const cors = require('cors')

const port = process.env.PORT || 3005

// express app
const app = express()

const corsOption = {
    origin: ["https://localhost:3000"],
};

// middlewares
app.use(cors(corsOption))
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.get('/', (req, res, next) => {
    res.json({ message: "Welcome to Stulivery app" })
    next()
})

// connect app
app.listen(port, () => {
    console.log("connected and listening on port " + port)
})