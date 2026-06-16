const multer = require('multer')
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2")
const { cloudinary } = require('../config/cloudinary')

// allow file Type

const allowFormats = ["jpg", "jpeg", "png", "webp"]

// Allowed mime types
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
]

exports.createUploader = (folderName) =>{

    // cloudinary storage 
    const storage = new CloudinaryStorage({
        cloudinary,
        params : async(req,file) => ( {
            folder : `dukanoo/${folderName}`,
            allowed_formats : allowFormats,
            transformation : [{width:500, height: 500, crop:"fill", quality:"auto"}],
            public_id : `${folderName}_${Date.now()}_${file.originalname.split(".")[0]}`
        })
    })
      // Return multer instance
    return multer({

        storage,

        limits: {
            fileSize: 5 * 1024 * 1024
        },



        // File validation
        fileFilter: (req, file, cb) => {

            if (allowedMimeTypes.includes(file.mimetype)) {

                cb(null, true)

            } else {

                cb(new Error("Only jpg png jpeg webp allowed"), false)
            }
        }
    })


    
}