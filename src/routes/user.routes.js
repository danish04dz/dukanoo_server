const express = require ('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    uploadUserAvatar,
    verifyOTP,
    resendOTP,
    sendTestMail

} = require ('../controllers/user.controller')

const { verifyJWT } = require('../middleware/auth.middleware')

// multer uploader middleware
const { createUploader } = require("../middleware/upload.middleware")

// avatar uploader
const uploadAvatar = createUploader("user")
    .single("avatar") 

// register user route and send otp to email for verification
router.post("/register", registerUser)


//  verify user using otp
router.post("/verify-otp",verifyOTP)

// resend otp route

router.post("/resend-otp", resendOTP);

// login user route
router.post("/login", loginUser)

// logout user route
router.post("/logout",verifyJWT, logoutUser)

// get user profile route
router.get("/profile", verifyJWT, getUserProfile)

// update user profile route
router.put("/profile", verifyJWT, updateUserProfile)

// upload/update avatar
router.put(
    "/upload-avatar",
    verifyJWT,
    uploadAvatar,
    uploadUserAvatar
)

// remove avatar

// test email
router.post("/test-email",sendTestMail)




module.exports = router