const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const Customer = require("../models/Customer");
const Credential = require("../models/Credential"); // Add this
const SECRET_KEY = process.env.JWT_SECRET || "this_is_my_secret"; // Use environment variable

// Protect routes (Authentication Middleware)
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Try to verify as Customer
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Customer.findById(decoded.id).select("-password");
        } catch (e) {
            // If fails, try as admin Credential
            decoded = jwt.verify(token, SECRET_KEY);
            req.user = await Credential.findOne({ username: decoded.username });
            if (req.user) req.user.role = decoded.role;
        }

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

// Role-Based Authorization Middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};