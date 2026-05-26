const User = require('../models/user.model')

// generate access and refresh token
const generateAccessAndRefreshTokens = async (userId)=>{
    try {
       const user = await User.findById(userId)

       const accessToken = user.generateAccessToken ()
       const refreshToken = user.generateRefreshToken ()

       user.refreshToken =refreshToken
       await user.save({
        validateBeforeSave : false
       })
       return  {accessToken, refreshToken}

        
    } catch (error) {
        console.log("error while generating access token",error);
        
    }
}

// register User Controller Logic
exports.registerUser = async (req, res) => {
    try {
        // get data from req body
        const { name, email, phone, password } = req.body

        // check empty fields 
        if(!name || !email || !phone || !password ) {
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        // check is user already exit or not 
        const existingUser = await User.findOne({
            $or :[{email},{phone}]
        })

        if (existingUser){
            return res.status(400).json({
                success : false,
                message : "user already exist with this email or phone number" 
            })
        }
        // create user in database 
        const user = await User.create({
            name,
            email,
            phone,
            password,
            isVerified : true,
        })
        
        // generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        // check user created or not and if created then remove sensitive fields  password and refresh token from response
        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        // cookie options
        const cookieOptions = {
            httpOnly : true,
            secure : true
        }

        if(!createdUser){
            return res.status(500).json({
                success : false,
                message : " something went wrong while creating User"
            })
        }

       return res
       .status(201)
       .cookie("refreshToken", refreshToken, cookieOptions)
       .cookie("accessToken", accessToken, cookieOptions)
       .json({
            success : true,

            message : "User registered successfully ! - Now verify the user",
            user : createdUser,
            accessToken : accessToken,
            refreshToken : refreshToken
        })
 
    }
    catch (error) {
        res.status(500).json({
            success : false,
            message : "Error in registering user",
            error : error.message
        })
    }

}

// user Login Controller Logic
exports.loginUser = async (req, res) => {
   try {
    // 1:- get user dta from the req.body

    const {email, phone , password} = req.body
 
    // 2:- check empty fields
    if((!email && !phone) || !password) {
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }

    // 3:- check user exist or not
    const user = await User.findOne({
        $or : [{email},{phone}]
    })

    if(!user) {
        return res.status(404).json({
            success : false,
            message : " User not found with this email or phone number"
        })
    }

    // 4:- check valid password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        return res.status(401).json({
            success : false,
            message : "Invalid password"
        })
    }

    // 5 :- generate  token

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // 6:- remove sensitive fields from response
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // 7:- cookie options
    const cookieOptions = {
        httpOnly : true,
        secure : true
    }

    // 6:-  send response with cookie
    return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json({
        success : true,
        message : "User logged in successfully",
        user : loggedInUser,
        accessToken : accessToken,
        refreshToken : refreshToken
     })

    
   } catch (error) {
     return res.status(500).json({
        success : false,
        message : "Error while Login User",
        err : error
     })
   }
    

}

// User Logout Controller
exports.logoutUser = async (req,res) =>{
    try {
       await User.findByIdAndUpdate(req.user._id,{
            $set : {
                refreshToken: undefined
            }
        })

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).clearCookie("accessToken",cookieOptions).clearCookie("refreshToken",cookieOptions).json({message: "User logged out successfully"})
        
    } catch (error) {
        console.log("error in logout controller", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

// get user profile controller
exports.getUserProfile = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken")
        .populate("shop")
        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User Not Found"
            })
        }
        return res.status(200).json({
            success : true,
            message : "User profile fetched successfully",
            user : user
        })

    }
    catch (error) {
        console.log("error in get user profile controller", error)
        return res.status(500).json({message: "error in get user profile controller",
            err : error
        })
        
    }
}

// update user profile controller (name, avatar, phone)


// change password controller 
