const express = require('express')

const router = express.Router()

const { createShopCategory,
    getAllCategoriesOfShop,
    deleteShopCategory
}
 = require('../controllers/category.controller')

const { isOwner, verifyJWT } = require('../middleware/auth.middleware')
const { createUploader } = require("../middleware/upload.middleware")




router.post('/create-shop-category',verifyJWT,isOwner,
    createUploader("shop-category").single("image"),
    createShopCategory)


// get all shop categories
router.get('/get-shop-categories',verifyJWT,isOwner,getAllCategoriesOfShop)

// get all shop categories
router.delete('/delete-shop-category/:categoryId',verifyJWT,isOwner,deleteShopCategory)

module.exports = router