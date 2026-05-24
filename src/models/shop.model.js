const mongoose = require ('mongoose')

const shopSchema =  new mongoose.Schema({
    shopName : {
        type : String,
        require : true,
        index: true // for better searching
    },
    slug : {
        type : String,
        
        unique : true,
        index : true
        
    },
    shopCategory : {
        type : String,
        enum : ["grocery", "generalStore", "bakery", "fastFood", "chai-shop", "restaurant", "electronics", "hardware", "other", "fruits"],
        default : "other"

    },

    description : {
        type : String
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    logo : {
        type : String

    },
    coverImage : {
        type : String
    },
    


},{timestamps: true})

module.exports = mongoose.model("Shop", shopSchema)