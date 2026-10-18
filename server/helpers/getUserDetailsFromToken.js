
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    try {
        if (!token) {
            return null;
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT secret is not configured');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded.id) {
            return null;
        }

        const user = await UserModel
            .findById(decoded.id)
            .select('-password');

        return user || null;
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
};

module.exports = getUserDetailsFromToken;
