const Shop = require('../models/shop.model')
const User = require('../models/user.model')

// create shop by owner
exports.createShop = async (req,res) => { 

    try {
        const { shopName, shopCategory, description, street, city, state, pincode} = req.body
        // check empty field
        if(!shopName || !shopCategory || ! description || !street || !city || !state || !pincode) {

            return res.status(400).json({
                success : false,
                message : "All fields Are Required"

            })

        }
        // check exiting shop by owner
        const existingShop = await Shop.findOne({
            owner : req.user.id
        }) 
        if(existingShop) {
            return res.status(400).json({
                success : false,
                message : "You already have a shop"
            })
        }

       

        // create shop
         const shop = await Shop.create({
            shopName,
            shopCategory,
            description,
            owner : req.user.id,
            address : {
                street,
                city,
                state,
                pincode
            }
         })

       

        return res.status(201).json({
            success : true,
            message : "Shop Created Successfully ! please wait for Admin approval",
            shop  
        })

        

    }
    catch (error) {
        return res.status(500).json({
            success : false,
            message : "internal server error while creating shop",
             error : error.message 
        })
    }
}


// get shop All details 

// Change shop settings
exports.changeShopSettings = async (req, res) => {

}

// add shop logo and cover image 
exports.updateShopLogoAndCoverImage = async   (req, res) => {

}

// 

