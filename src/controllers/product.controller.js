const Shop = require('../models/shop.model')
const User = require('../models/user.model')
const Category = require('../models/category.model')
const Product = require('../models/product.model')
const {cloudinary} = require('../config/cloudinary')



// add Product (Create new product )
exports.newProduct = async (req, res) =>{
    try {
       
        const { 
            productCategory,
            productName,
            productDescription, 
            barCode, 
            price, 
            mrp, 
            costPrice, 
            unit, 
            stock
        } = req.body
        const image = req.file?.path;

        //1 validate product category
        if(!productCategory){
            return res.status(401).json({
                success : false,
                msg : "Select Product Category "
            })
        } 

        // 2-validate product name and price
        if(!productName || price <1){
            return res.status(401).json({
                success : false,
                msg : "product name and price is required and price is minimum 1"
            })
        }

         // 3- check image
        if(!req.file) {
            return res.status(400).json({
                status : false,
                msg : "Product image is required"
            })
        }
        // 4. Find owner's shop FIRST
        const shop = await Shop.findOne({
            owner: req.user._id
        });

        if (!shop) {
            return res.status(404).json({
                success: false,
                msg: "Shop not found for this owner"
            });
        }

        // 5. Check category belongs to this shop
        const category = await Category.findOne({
            catName: productCategory.trim(),
            shop: shop._id
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: `Category "${productCategory}" not found in your shop`
            });
        }

        // 6. Check duplicate product
        const existingProduct = await Product.findOne({
            shopId: shop._id,
            categoryId: category._id,
            productName: productName.trim()
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                msg: "This product already exists in this category"
            });
        }

       
            // create new product

            const newProduct = await Product.create({
                shopId: shop._id,
                categoryId: category._id,
                productName: productName.trim(),
                productImage: req.file.path,

            productDescription: productDescription?.trim(),

            barCode: barCode?.trim(),

            price: price || 0,

            mrp:mrp || 0 ,

            stock: stock,

            costPrice: costPrice || 0,

            unit: unit || "pcs",

           
            })

           
          

        return res.status(201).json({
            success: true,
            msg: "Product created successfully",
            data: newProduct
        });

        

        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            msg : "error while creating product! , Unable to add the product "

        })
        
    }
}
// get all products of a shop and filter by category
exports.getProductsByCategory = async (req, res) => {

    try {
        
        
        
    } catch (error) {
        
        return res.status(400).json({
        success: false,
        msg: "Error while get product by category"
    });
    }
    
}
            

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
   try {
     // delete selected product by id

    const productId = req.params._id

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            msg: "Product not found"
        });
    }

    return res.status(200).json({
        success: true,
        msg: "Product deleted successfully"
    });

   }
   catch (error) {
    return res.status(400).json({
        success: false,
        msg: "Error while deleting product"
    });

   }

}