const express = require ('express')
const router = express.Router()

const { registerUser, loginUser, logoutUser, getUserProfile} = require ('../controllers/user.controller')
const { verifyJWT } = require('../middleware/auth.middleware')

// register user route
router.post("/register", registerUser)

// login user route
router.post("/login", loginUser)

// logout user route
router.post("/logout",verifyJWT, logoutUser)

// get user profile route
router.get("/profile", verifyJWT, getUserProfile)





module.exports = router