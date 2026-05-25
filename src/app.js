const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' })
})

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Welcome to the Dukanoo API - use /api/v1/* for app routes' })
})


// User Routes
const userRoutes = require('./routes/user.routes')
app.use('/api/v1/users', userRoutes)



module.exports = app