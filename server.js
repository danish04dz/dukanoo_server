const dotenv = require('dotenv')

dotenv.config({ path: './.env' })

const { connectDB } = require('./src/config/connectDB')
const app = require('./src/app')

const PORT = process.env.PORT || 6000
let server

connectDB()
    .then(() => {
        server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Database connection failed', err)
        process.exit(1)
    })

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason)
    if (server) {
        server.close(() => process.exit(1))
    } else {
        process.exit(1)
    }
})

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error)
    if (server) {
        server.close(() => process.exit(1))
    } else {
        process.exit(1)
    }
})
