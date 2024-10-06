// middleware/auth.js

const jwt = require('jsonwebtoken');
const Usuario = require('../model/Usuario');

const verifyToken = (roles = []) => {
    return async (req, res, next) => {
        const token = req.headers['authorization'];
        console.log("Authorization Header:", req.headers['authorization']);  // Log the authorization header

        if (!token) {
            console.log("No token provided");
            return res.status(403).json({ message: 'No token provided' });
        }

        // Extract the token after "Bearer "
        const actualToken = token.split(' ')[1];
        console.log("Extracted Token:", actualToken);  // Log the token being processed

        try {
            const decoded = jwt.verify(actualToken, process.env.SECRET);
            console.log("Decoded Token:", decoded);  // Log the decoded token data
            req.user = decoded;

            const usuario = await Usuario.findByPk(decoded.id);
            if (!usuario) {
                console.log("User not found in the database with ID:", decoded.id);
                return res.status(403).json({ message: 'User not found' });
            }

            console.log("Found User:", usuario);  // Log the found user details

            // Check role access
            if (roles.length && !roles.includes(usuario.rol)) {
                console.log(`Access denied for role: ${usuario.rol}`);
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (err) {
            console.error("Token verification error:", err.message);  // Log the error during token verification
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = verifyToken;
