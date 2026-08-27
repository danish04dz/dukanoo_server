const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    shopId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop",
        required : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    productName : {
        type : String,
        required : true
    },
    productImage : {
        type : String,
        required : true
    },
    productDescription :{
        type : String
    },
    barCode : {
        type : String

    },
    price : {
        type : Number,
        min : 1,
        required : true
    },
    mrp : {
        type : Number

    },
    costPrice : {
        type :  Number

    },
    unit : {
        type : String,
        enum : ["pcs", "kg", "gram", "L", "ml", "dozen","box", "pack"],
        default: "pcs"
    },

    isAvailable : {
        type : Boolean,
        default: true
    },
    isVisible : {
        type : Boolean,
        default : true
    },
    sortOrder : {
        type : Number,
        default :0
    },
    stock : {
        type : Number,
        default : 0
    },
    isVeg :{
        type : Boolean,
        default : true
    }



},{timestamps : true})

module.exports = mongoose.model("Product",productSchema)
