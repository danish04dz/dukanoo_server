const User = require('../models/user.model')
const Shop = require('../models/shop.model')


const { sendMail } = require('../utils/mailSender')

const { shopStatusEmailTemplate } = require('../mails/shopStatusUpdateMailTemplate')



// get all Shops By Admin
exports.getAllShops = async (req, res) => {
    try {

        const shops = await Shop.find()
        .populate("owner")
        .sort({ createdAt: -1 });


         return res.status(200).json({
      success: true,
      count: shops.length,
      data: shops,
    });

        
    } catch (error) {
        console.log(error)
         return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            err : error
        })
    }
}


// Approve or Reject Shop by Admin (update status of shop)
exports.updateShopStatus = async (req,res) => {
    try {

        const { status } = req.body

        const allowedStatus = [
            "approved",
            "rejected",
            "suspended"
        ]
    
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }
        // check shop exist or not
        
        const shop = await Shop.findById(req.params.shopId)
        .populate("owner", "name email");

          if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

         shop.status = status;

        
        if(status === "approved"){
            shop.isActive = true
        }
        if (status === "suspended") {
            shop.isActive = false;
        }


        if (status === "rejected"){
            shop.isActive = false;

        }

        await shop.save();
        
        // Send Email Notification
        await sendMail(
            shop.owner.email,
            `Dukanoo | ${shop.shopName} - Shop ${status.toUpperCase()}`,
            shopStatusEmailTemplate(
                shop.owner.name,
                shop.shopName,
                status
            )
        );

        return res.status(200).json({
            success: true,
            message: `Shop status updated to ${status}`,
            shop
        });
        


    }
    catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}