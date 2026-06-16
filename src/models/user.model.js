const mongoose = require('mongoose')

// jwt and bcrypt 
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    name  : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },
    phone  : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        url : String,
        public_id: String
    },
    role : {
        type : String,
        enum : ["guest", "owner", "customer", "admin"],
        default : "guest"
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isActive : {
        type : Boolean,
        default :true
    },
    shop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop"

    },
    refreshToken : {
        type : String
    },

    otp : {
        type : String
    },
    otpExpiry : {
        type : Date
    }
  

},{timestamps:true})

// encrypt password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
        return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
    
})

// check password (user ne sahi password likha hai y nahi)
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)    
}

// access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign (
        {
            _id : this._id,
            name : this.name,
            email : this.email,
            phone : this.phone
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// refresh Token
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
module.exports = mongoose.model("User", userSchema)