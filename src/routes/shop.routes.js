const express = require('express')

const router = express.Router()

const { createShop,
     getShopAllDetail,
    createShopCategory,
    getAllCategoriesOfShop,
    deleteShopCategory

}
 = require('../controllers/shop.controller')
const { isOwner, verifyJWT } = require('../middleware/auth.middleware')
const { createUploader } = require("../middleware/upload.middleware")



router.post('/create-shop',verifyJWT,isOwner,createShop)
router.get('/get-shop-details',verifyJWT,isOwner,getShopAllDetail)

router.post('/create-shop-category',verifyJWT,isOwner,
    createUploader("shop-category").single("image"),
    createShopCategory)


// get all shop categories
router.get('/get-shop-categories',verifyJWT,isOwner,getAllCategoriesOfShop)

// get all shop categories
router.delete('/delete-shop-category/:categoryId',verifyJWT,isOwner,deleteShopCategory)

module.exports = router