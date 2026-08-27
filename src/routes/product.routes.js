const express = require('express')

const router = express.Router()


const { newProduct } = require('../controllers/product.controller')
const { isOwner, verifyJWT } = require('../middleware/auth.middleware')
const { createUploader } = require("../middleware/upload.middleware")





// create new product
router.post('/create-product',verifyJWT,isOwner,
    createUploader("product").single("image"),
    newProduct)



module.exports = router