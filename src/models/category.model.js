const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    shop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop"
    },
    catName : {
        type : String,
        required : true
    },
    image  :{ 
        type : String
    },
    // optional Description
    description : {
        type : String
    },
    // is visible on QR or not 
    isVisible : {
        type : Boolean,
        default : true
    },
    isActive : {
        type : Boolean,
        default : true
    }

},{timestamps: true})

module.exports = mongoose.model("Category", categorySchema)