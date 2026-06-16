const express = require('express')

const router = express.Router()

const { createShop } = require('../controllers/shop.controller')
const { isOwner, verifyJWT } = require('../middleware/auth.middleware')

router.post('/create-shop',verifyJWT,isOwner,createShop)


module.exports = router