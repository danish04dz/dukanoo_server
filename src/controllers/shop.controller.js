const Shop = require('../models/shop.model')
const User = require('../models/user.model')
const Category = require('../models/category.model')
const {cloudinary} = require('../config/cloudinary')

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

//  create shop Category

exports.createShopCategory = async (req,res) => {
    try {
        const {catName, description } = req.body
        const image = req.file?.path;


        
        // check empty fields 
        if(!catName) {
            return res.status(400).json({
                status : false,
                msg : "All fields are required"
            })
        }

        // check image
        if(!req.file) {
            return res.status(400).json({
                status : false,
                msg : "Category image is required"
            })
        }

        // find shop by owner id 
        const shop = await Shop.findOne({
            owner : req.user.id
        })
        if(!shop) { 
            return res.status(404).json({
                success : false,
                msg : "Shop not found for this owner"
            })
        }

        // check if category already exist for the shop or not
        const existingCategory = await Category.findOne({
            shop : shop.id,
            catName : catName
        })
        if (existingCategory ){
            return res.status(400).json({
                success : false,
                msg : "This Category already exist for this shop"
            })
        }
       

     

       


        

        // create category for the shop 
        const category = await Category.create({
            shop : shop.id,
            catName,
            image:{
                 url: req.file.path,
            public_id: req.file.filename
            },
            description     
        })

        return res.status(201).json({
            success : true,
            msg : "Shop Category Created Successfully",
            data: category
        })

        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success : false,
            msg : "unable to create shop Category ",
            err: error
        })
    }
}

// get all Categories of a shop
exports.getAllCategoriesOfShop = async (req,res) => {
    try{
        const shop = await Shop.findOne({
            owner : req.user.id
        })
        if(!shop){
            return res.status(404).json({
                success : false,
                msg : "Shop not found for this owner"
            })
        }
        const categories = await Category.find({
            shop : shop.id
        })  

        return res.status(200).json({
            success : true,
            msg : "Shop categories fetched successfully",
            data: categories
        })
    }
    catch(error){
        console.log(error)
        return res.status(401).json({
            success : false,
            msg : "unable to fetch shop categories ",
            err: error
        })
    }
}

// Delete shop Category
exports.deleteShopCategory = async (req, res) => {
    try{
        const { categoryId } = req.params

        // get owner id to find the shop
        const ownerId = req.user.id
        const shop = await Shop .findOne ({
            owner : ownerId
        })
        if(!shop){
            return res.status(404).json({
                success : false,
                msg : "Shop not found for this owner"
            })
        }
        // now find the category to delete We need to check if the category belongs to the shop or not
        const category = await Category.findOne({
            _id : categoryId,
            shop : shop.id
        })

        if(!category){
            return res.status(404).json({
                success : false,
                msg : "Category not found for this shop"
            })
        } 
        
        // delete the category Also we can delete the image from cloudinary if needed
        if(category.image && category.image.public_id){
            await cloudinary.uploader.destroy(category.image.public_id)
        }
        await category.deleteOne()

        return res.status(200).json({
            success : true,
            msg : "Shop category deleted successfully"
        })  



    }
    catch(error){
        console.log(error)
        return res.status(401).json({
            success : false,
            msg : "unable to delete shop category ",
            err: error
        })
    }

}