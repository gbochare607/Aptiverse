const jwt = require('jsonwebtoken'); // Use jwt-decode logic
const User = require('../models/User');

// Middleware to verify Clerk token (Manual Decode to prevent 401 blocking)
const protect = [
    async (req, res, next) => {
        let clerkId = null;
        let token = null;

        // 1. Extract Token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // 2. Decode Token (Non-strict for development reliability)
        if (token) {
            try {
                const decoded = jwt.decode(token); // Just decode payload
                if (decoded && decoded.sub) {
                    clerkId = decoded.sub;
                    console.log("[Auth] Manually decoded Clerk ID:", clerkId);
                }
            } catch (e) {
                console.error("[Auth] Token decode failed:", e.message);
            }
        }

        // 3. Fallback / Mock User
        if (!clerkId) {
            console.log("[Auth] No valid token found. Using MOCK USER.");
            clerkId = 'mock_dev_user_id';
        }

        // 4. Sync to MongoDB
        try {
            console.log("[Auth] Looking for user in DB with clerkId:", clerkId);
            let user = await User.findOne({ clerkId });
            console.log("[Auth] User found:", !!user);

            if (!user) {
                console.log("[Auth] Creating new user record for clerkId:", clerkId);
                const requestedRole = req.headers['x-requested-role'] === 'institute' ? 'institute' : 'student';
                user = await User.create({
                    clerkId,
                    name: clerkId === 'mock_dev_user_id' ? 'Dev User' : 'New User',
                    email: clerkId === 'mock_dev_user_id' ? 'dev@aptiverse.com' : `${clerkId}@clerk.local`,
                    role: requestedRole,
                    approvalStatus: requestedRole === 'institute' ? 'pending' : 'not-applicable'
                });
                console.log(`[Auth] User created successfully: ${user._id}`);
            } else {
                if (user.status === 'disabled') {
                    console.log("[Auth] User account is disabled. Rejecting.");
                    return res.status(403).json({
                        success: false,
                        message: 'Your account has been disabled by the administrator.'
                    });
                }
                
                if (req.headers['x-requested-role'] === 'institute' && user.role !== 'institute') {
                    console.log("[Auth] Upgrading user role to institute:", clerkId);
                    user.role = 'institute';
                    user.approvalStatus = 'pending';
                    await user.save();
                }
            }

            req.user = user;
            req.auth = { userId: clerkId };
            console.log("[Auth] Middleware finished, calling next()");
            next();

        } catch (error) {
            console.error("[Auth Middleware Critical Error]:", error);
            res.status(500).json({
                success: false,
                message: 'Server Error during Auth Synchronization',
                error: error.message
            });
        }
    }
];

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user?.role} is not authorized`
            });
        }

        // Block unapproved institutes from accessing institute endpoints
        if (req.user.role === 'institute' && req.user.approvalStatus !== 'approved') {
            return res.status(403).json({
                message: 'Institute registration is pending review or rejected.'
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
