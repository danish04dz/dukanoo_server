const mongoose = require('mongoose')
const { DB_Name } = require('../utils/constants')

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_Name,
            
            
        })
        console.log('DB Connected Successfully!')
    } catch (error) {
        console.error('Database connection failed', error)
        process.exit(1)
    }
}

