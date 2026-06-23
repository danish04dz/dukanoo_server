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


// get shop All details (get MY SHOP) 
exports.getShopAllDetail = async (req, res) => {
    try {
        // get owner id from the req.user
    const ownerId = req.user.id
    
    // find shop detail using owner id 
    const shopDetails = await Shop.findOne
    ({
       owner: ownerId
    })
    .populate("owner", "name email phone")

    if(!shopDetails) {
         return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
    }

     return res.status(200).json({
            success: true,
            data: shopDetails
        });
        
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : " error while getting shop details",
            error  
        })
    }
    
}
// Change shop settings
exports.changeShopSettings = async (req, res) => {

}

// add shop logo and cover image 
exports.updateShopLogoAndCoverImage = async   (req, res) => {

}

// 

