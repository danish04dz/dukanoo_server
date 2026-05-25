const express = require ('express')
const router = express.Router()

const { registerUser, loginUser } = require ('../controllers/user.controller')

// register user route
router.post("/register", registerUser)

// login user route
router.post("/login", loginUser)





module.exports = router