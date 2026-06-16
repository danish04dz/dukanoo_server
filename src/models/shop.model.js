const mongoose = require ('mongoose')
const crypto = require('crypto');


const slug = require ('mongoose-slug-updater')

mongoose.plugin(slug, {
    separator: '-'
})

const shopSchema =  new mongoose.Schema({
    shopName : {
        type : String,
        required : true,
        trim : true,
        index: true // for better searching
    },
    slug : {
        type : String,
        slug : "shopName", // for unique shop url
        unique : true,
        index : true,
        slugPaddingSize: 4
        
    },
    shopCategory : {
        type : String,
        enum : ["grocery", "generalStore", "bakery", "fastFood", "chai-shop", "restaurant", "electronics", "hardware", "other", "fruits"],
        default : "other"

    },

    description : {
        type : String ,
        maxlength : 500
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
    
    // address of shop 
    address : {
        street : {
            type : String,
            required : true,
            trim : true

        },
        city : {
            type : String,
            required : true

        },
        state : {
            type : String,
            required : true
        },
        pincode : {
            type : String,
            required : true,
            match : [/^\d{6}$/] // pincode check 6 digit
        },
        // shop map location in future latitude longitude

    },
    // Business Details
    gstin : {
        type : String,
        uppercase : true,
        match : [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN"]

    },
    //optional phone number
    shopPhone : {
        type : String,


    },

    // QR code System
    qrCode : {
        type : String
    },
    qrToken : {
        type : String,
        unique :true,
        index:true,
        default : () => crypto.randomUUID() // naya documnt bante hi uuid auto generate krega

    },
    isOpen : {
        type : Boolean,
        default :true
    },


    /// -----   SETTINGS   ------
    settings : {
        
        acceptQROrder : {
            type :Boolean,
            default : true
        },
        currency : {
            type : String,
            default : "INR"
        },
        taxRate : {
            type : Number,
            default : 0,
            min :0,
            max :100
        },


    },

    // Subscription Plan

    plan : {
        type : String,
        enum : ["free_trial", "pro", "expired"],
        default: "free_trial"
    },
    planExpiresAt : {
        type : Date,
       

    },

    isActive : {
        type : Boolean,
        default : true
    },
    status :{
        type : String,
        enum : ["pending", "approved", "rejected", "suspended"],
        default : "pending"

    }


},{timestamps: true})


module.exports = mongoose.model("Shop", shopSchema)