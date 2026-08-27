const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber:{
        type : String,
        require: true
    },
    shopId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop",
        required : true
    },
    
}, { timestamps : true})

module.exports = mongoose.model("Order", orderSchema)