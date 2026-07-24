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
        url : String,
        public_id: String
    },
    // optional Description
    description : {
        type : String
    },
    // to mange number of items in category
    itemCount :{
        type : Number,
        default : 0
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