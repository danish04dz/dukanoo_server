const express = require('express')

const router = express.Router()

const { createShop, getShopAllDetail } = require('../controllers/shop.controller')
const { isOwner, verifyJWT } = require('../middleware/auth.middleware')

router.post('/create-shop',verifyJWT,isOwner,createShop)
router.get('/get-shop-details',verifyJWT,isOwner,getShopAllDetail)


module.exports = router