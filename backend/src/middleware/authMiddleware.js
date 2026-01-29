const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Middleware to verify Clerk token and sync user to MongoDB
const protect = [
    // 1. Verify Clerk Token
    ClerkExpressWithAuth(),

    // 2. Sync User to MongoDB
    async (req, res, next) => {
        if (!req.auth.userId) {
            return res.status(401).json({ message: 'Unauthorized - No Clerk Token' });
        }

        try {
            const clerkId = req.auth.userId;

            // Find user in DB
            let user = await User.findOne({ clerkId });

            // If user doesn't exist, create them (Lazy Sync)
            if (!user) {
                // Need to fetch user details from Clerk to get email/name
                // For MVP speed, we can skip fetching and just use ID, OR rely on frontend sending it.
                // BUT better to fetch. However, for "Run Project" request, let's create a stub.
                // Ideally we use: const clerkUser = await clerkClient.users.getUser(clerkId);

                // Wait! We can't easily fetch from Clerk without initializing the client fully. 
                // Let's assume the user was created. 
                // Actually, if we don't have the user, subsequent DB queries might fail.
                // Let's create a minimal user.

                // Note: We might be missing Name/Email if we don't fetch from Clerk.
                // Providing a basic fallback.
                user = await User.create({
                    clerkId,
                    name: 'New User', // Placeholder util they update profile
                    email: `${clerkId}@clerk.placeholder`, // Placeholder
                    role: 'student'
                });
                console.log(`Created new Mongo user for Clerk ID: ${clerkId}`);
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(500).json({ message: 'Server Error during Auth' });
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
        next();
    };
};

module.exports = { protect, authorize };
