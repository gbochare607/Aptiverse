const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const admin = await Admin.findById(decoded.id).select('-password');
            if (!admin) {
                return res.status(401).json({ message: 'Not authorized, admin user not found' });
            }
            
            req.admin = admin;
            next();
        } catch (error) {
            console.error('[Admin Auth Error]:', error.message);
            res.status(401).json({ message: 'Not authorized, token validation failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protectAdmin };
