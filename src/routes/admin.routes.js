const express = require('express')

const router = express.Router()


const { isAdmin, verifyJWT } = require('../middleware/auth.middleware')
const { getAllShops, updateShopStatus } = require('../controllers/admin.controller')

router.get('/get-all-shops',verifyJWT,isAdmin,getAllShops)

router.patch('/update-shop-status/:shopId', verifyJWT,isAdmin, updateShopStatus )


module.exports = router