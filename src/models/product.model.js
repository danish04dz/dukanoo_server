const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    shopId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop",
        required : true
    }



},{timestamps : true})

module.exports = mongoose.model("Product",productSchema)
