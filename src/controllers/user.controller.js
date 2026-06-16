const User = require('../models/user.model')
const {cloudinary} = require('../config/cloudinary')

const { sendMail } = require('../utils/mailSender')
const { verifyOTPEmailTemplate } = require('../mails/verifyOTP')

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

        const { name, email, phone, password, role } = req.body;

        // validation
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // existing user check
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // create user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role,
            otp,
            otpExpiry,
            isVerified: false
        });

        // send mail
        await sendMail(
            email,
            "Dukanoo | OTP Verification",
            verifyOTPEmailTemplate(name, otp)
        );

        return res.status(201).json({
            success: true,
            message:
                "User registered successfully. Please verify OTP sent to email.",
            userId: user._id
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error in registering user",
            error: error.message
        });
    }
};

//  verify OTP Controller
exports.verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        // validation
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already verified"
            });
        }

        // check otp
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // check expiry
        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        // verify user
        user.isVerified = true;

        // clear otp
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        // generate tokens
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        // remove sensitive data
        const verifiedUser = await User.findById(user._id)
            .select("-password -refreshToken");

        // cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                cookieOptions
            )
            .cookie(
                "refreshToken",
                refreshToken,
                cookieOptions
            )
            .json({
                success: true,
                message: "OTP verified successfully",
                user: verifiedUser,
                accessToken,
                refreshToken
            });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error while verifying OTP",
            error: error.message
        });
    }
};

// resend OTP controller
// resend OTP controller
exports.resendOTP = async (req, res) => {
    try {

        const { email } = req.body;

        // validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified"
            });
        }

        // cooldown check (60 seconds)
        if (
            user.otpExpiry &&
            user.otp &&
            (user.otpExpiry.getTime() - Date.now()) >
                (10 * 60 * 1000 - 60 * 1000)
        ) {
            return res.status(429).json({
                success: false,
                message:
                    "Please wait 60 seconds before requesting another OTP"
            });
        }

        // generate new OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP valid for 10 minutes
        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // save OTP
        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save({
            validateBeforeSave: false
        });

        // send email
        await sendMail(
            user.email,
            "Dukanoo | OTP Verification",
            verifyOTPEmailTemplate(
                user.name,
                otp
            )
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.log(
            "Error while resending OTP:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Error while resending OTP",
            error: error.message
        });
    }
};


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
    // check if user is verified or not
    if(!user.isVerified) {
        return res.status(401).json({
            success : false,
            message : "Please verify your email before logging in"
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
exports.updateUserProfile = async (req, res) => {
    try {

        const { name, email, phone } = req.body

        // check empty fields
        if (!name && !email && !phone) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update profile"
            })
        }

        // check user exist
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        // duplicate check
        const query = []

        if(email) query.push({ email })
        if(phone) query.push({ phone })

        if(query.length > 0){

            const existingUser = await User.findOne({
                $or: query,
                _id: { $ne: req.user._id }
            })

            if(existingUser){
                return res.status(400).json({
                    success: false,
                    message: "Email or phone already in use"
                })
            }
        }

        // update fields
        if(name) user.name = name
        if(email) user.email = email
        if(phone) user.phone = phone

        await user.save()

        const updatedUser = await User.findById(user._id)
            .select("-password -refreshToken")

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })

    } catch (error) {

        console.log("error in update user profile controller", error)

        return res.status(500).json({
            success: false,
            message: "Error in update user profile controller",
            error: error.message
        })
    }
}

// upload user avatar controller
exports.uploadUserAvatar = async (req,res) => {
    try {
        if(!req.file || !req.file.path) {
            return res.status(400).json({
                success : false,
                message : "Avatar image is required"
            })
        }
        // find user
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // remove old avatar from cloudinary
        if (user.avatar && user.avatar.public_id) {

            await cloudinary.uploader.destroy(
                user.avatar.public_id
            )
        }

        // save new avatar
        user.avatar = {
            url: req.file.path,
            public_id: req.file.filename
        }

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            avatar: user.avatar
        })

    }
    catch (error) {
        console.log("error in upload user avatar controller", error)
        return res.status(500).json({
            success: false,
            message: "Error in upload user avatar controller",
            error: error.message
        })
    }
}

// change password controller 

exports.sendTestMail = async (req, res) => {

    try {

        const { email } = req.body;

        // Validation
        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Generate Random OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        );

        // Generate HTML Template
        const html = verifyOTPEmailTemplate(
            "Danish",
            otp
        );

        // Send Email
        await sendMail(
            email,
            "OTP Verification",
            html
        );

        return res.status(200).json({
            success: true,
            message: "Test email sent successfully",
            otp
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to send email",
            error: error.message
        });
    }
};