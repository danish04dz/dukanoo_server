const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Verify JWT Middleware
exports.verifyJWT = async (req, res, next) => {
    try {

        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized Access"
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Invalid Access Token"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            msg: "JWT Verification Failed",
            error: error.message
        });
    }
};


// Admin Middleware
exports.isAdmin = (req, res, next) => {

    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "Access Denied - Admin Only"
        });
    }

    next();
};


// Owner Middleware
exports.isOwner = (req, res, next) => {

    if (req.user?.role !== "owner") {
        return res.status(403).json({
            success: false,
            msg: "Access Denied - Owner Only"
        });
    }

    next();
};


// Customer Middleware
exports.isCustomer = (req, res, next) => {

    if (req.user?.role !== "customer") {
        return res.status(403).json({
            success: false,
            msg: "Access Denied - Customer Only"
        });
    }

    next();
};


